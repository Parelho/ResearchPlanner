import React, { useEffect, useState } from "react";
import { getAllResearchersByManager } from "../../data/researcher";
import { supabase } from "../../data/supabaseClient.js";
import { getManager } from "../../data/managerStore.js";
import { getUserEmail } from "../../data/user.js";
import GanttChart from "../Planner/components/ganttChart.jsx";
import jsPDF from "jspdf";



export default function Projects() {
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [manager, setManager] = useState(null);
    const [researchersData, setResearchersData] = useState([]);
    const [managerEmail, setManagerEmail] = useState("");

    useEffect(() => {
        const fetchAllData = async () => {
            try {
                const currentManager = await getManager();
                setManager(currentManager);

                const email = await getUserEmail(currentManager);
                setManagerEmail(email);

                const researchers = await getAllResearchersByManager(currentManager);
                setResearchersData(researchers || []);

                const { data, error } = await supabase
                    .from("projects")
                    .select("*")
                    .eq("manager", currentManager);

                if (error) {
                    console.error("Erro ao buscar projetos:", error);
                } else {
                    setProjects(data);
                }
            } catch (err) {
                console.error("Erro geral ao buscar dados:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchAllData();
    }, []);

    const exportPdf = async (project) => {
        try {
            const { title: projectTitle, cost: budget, researchers: selectedResearchers = [], tasks = [] } = project;

            // Pesquisadores formatados
            const selectedNames = researchersData
                .filter(r => selectedResearchers.includes(r.id))
                .map(r => `- ${r.name}`)
                .join("\n");

            // Linhas das tarefas formatadas
            const taskLines = tasks
                .map(task =>
                    `Tarefa: ${task.title}\nDescrição: ${task.description || "Sem descrição"}\nInício: ${task.startDate ? new Date(task.startDate).toLocaleDateString() : "Não definido"}\nDuração: ${task.duration} dia(s)`
                )
                .join("\n\n");

            const pdf = new jsPDF({
                orientation: "portrait",
                unit: "px",
                format: "a4",
            });

            const pageWidth = pdf.internal.pageSize.getWidth();
            const margin = 40;
            let y = margin;

            // Título
            pdf.setFillColor(41, 128, 185);
            pdf.setTextColor(255, 255, 255);
            pdf.setFontSize(20);
            pdf.rect(0, y - 10, pageWidth, 40, "F");
            pdf.text(projectTitle || "Projeto sem título", pageWidth / 2, y + 15, { align: "center" });
            y += 50;

            // Responsável e verba
            pdf.setTextColor(0, 0, 0);
            pdf.setFontSize(12);
            pdf.text(`Responsável: ${managerEmail}`, margin, y);
            y += 20;
            pdf.text(`Verba estimada: R$ ${budget !== undefined ? budget.toFixed(2) : "(não preenchido)"}`, margin, y);
            y += 30;

            // Pesquisadores
            pdf.setFontSize(14);
            pdf.text("Pesquisadores Selecionados:", margin, y);
            y += 20;
            pdf.setFontSize(11);
            pdf.setFont("courier", "normal");
            pdf.text(selectedNames || "(nenhum selecionado)", margin + 10, y);
            y += (selectedNames ? selectedNames.split("\n").length : 1) * 14 + 20;

            // Tarefas
            pdf.setFontSize(14);
            pdf.setFont("helvetica", "bold");
            pdf.text("Tarefas:", margin, y);
            y += 20;
            pdf.setFont("courier", "normal");
            pdf.setFontSize(11);
            pdf.text(taskLines || "(nenhuma tarefa adicionada)", margin + 10, y);
            y += (tasks.length || 1) * 28 + 30;

            // Rodapé
            const dataHoje = new Date().toLocaleDateString();
            pdf.setFontSize(10);
            pdf.setTextColor(150);
            pdf.text(`Gerado em: ${dataHoje}`, pageWidth - margin, pdf.internal.pageSize.getHeight() - 20, { align: "right" });

            pdf.save(`${projectTitle || "projeto"}.pdf`);

        } catch (error) {
            console.error("Erro ao exportar PDF:", error);
            // Aqui pode substituir alert por modal, se quiser
        }
    };

    return (
        <div className="min-h-screen bg-white p-8">
            <div className="max-w-4xl mx-auto">
                <h1 className="text-4xl font-bold mb-8 text-center text-gray-800">
                    Projetos do {managerEmail || "Gerente"}
                </h1>

                {loading ? (
                    <p className="text-center text-gray-600">Carregando projetos...</p>
                ) : projects.length === 0 ? (
                    <p className="text-center text-gray-600">Nenhum projeto encontrado.</p>
                ) : (
                    <ul className="space-y-6">
                        {projects.map((project) => (
                            <li
                                key={project.id}
                                className="bg-gray-100 p-6 rounded-lg shadow mb-8 border-[6px] border-black"
                            >
                                <h2 className="text-2xl font-semibold text-blue-700 mb-2">
                                    {project.title}
                                </h2>
                                <p className="text-gray-700 mb-1">
                                    <strong>Verba Calculada:</strong>{" "}
                                    R$ {project.cost?.toFixed(2) || "0.00"}
                                </p>
                                <p className="text-gray-700 mb-1">
                                    <strong>Gerente:</strong> {managerEmail}
                                </p>

                                <div className="mt-3">
                                    <strong className="text-gray-800">Pesquisadores:</strong>
                                    {project.researchers && project.researchers.length > 0 ? (
                                        <ul className="list-disc list-inside mt-1 text-gray-700">
                                            {project.researchers.map((id) => {
                                                const researcher = researchersData.find((r) => r.id === id);
                                                return (
                                                    <li key={id}>
                                                        {researcher ? researcher.name : id}
                                                    </li>
                                                );
                                            })}
                                        </ul>
                                    ) : (
                                        <p className="text-gray-600 italic mt-1">
                                            Nenhum pesquisador vinculado.
                                        </p>
                                    )}
                                </div>

                                <div className="mt-3">
                                    <strong className="text-gray-800">Tarefas:</strong>
                                    {project.tasks && project.tasks.length > 0 ? (
                                        <>
                                            <ul className="list-decimal list-inside mt-1 text-gray-700 space-y-1">
                                                {project.tasks.map((task, idx) => (
                                                    <li key={idx} className="border p-2 rounded bg-gray-50">
                                                        <p><strong>Título:</strong> {task.title}</p>
                                                        <p><strong>Descrição:</strong> {task.description || "Sem descrição"}</p>
                                                        <p>
                                                            <strong>Início:</strong>{" "}
                                                            {task.startDate ? new Date(task.startDate).toLocaleDateString() : "Não definido"}
                                                        </p>
                                                        <p><strong>Duração:</strong> {task.duration} dia(s)</p>
                                                    </li>
                                                ))}
                                            </ul>
                                            <div id="gantt-chart-container" className="mt-6">
                                                <GanttChart tasks={project.tasks} />
                                            </div>
                                        </>
                                    ) : (
                                        <p className="text-gray-600 italic mt-1">Nenhuma tarefa cadastrada.</p>
                                    )}

                                </div>
                                <button
                                    onClick={() => exportPdf(project)}
                                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded mt-6"
                                >
                                    Exportar em PDF
                                </button>



                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    );
}
