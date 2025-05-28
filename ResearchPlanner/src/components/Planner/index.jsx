import React, { useState, useEffect } from "react";
import { getAllResearchersByManager } from "../../data/researcher";
import { getManager } from "../../data/managerStore.js";
import { getUserEmail } from "../../data/user.js";
import GanttChart from "./components/ganttChart.jsx";
// import * as htmlToImage from "html-to-image";
import jsPDF from "jspdf";

export default function Planner() {
    const [projectTitle, setProjectTitle] = useState("");
    const [search, setSearch] = useState("");
    const [selectedResearchers, setSelectedResearchers] = useState([]);
    const [budget, setBudget] = useState("");
    const [researchersData, setResearchersData] = useState([]);
    const [managerEmail, setManagerEmail] = useState("");
    const [tasks, setTasks] = useState([]);
    const [newTaskTitle, setNewTaskTitle] = useState("");
    const [newTaskDescription, setNewTaskDescription] = useState("");
    const [showConfirmation, setShowConfirmation] = useState(false);
    const [missingFields, setMissingFields] = useState([]);
    const [continueExport, setContinueExport] = useState(false);


    const handleAddTask = () => {
        if (!newTaskTitle.trim()) return;
        const newTask = {
            id: tasks.length + 1,
            title: newTaskTitle.trim(),
            description: newTaskDescription.trim(),
        };
        setTasks(prev => [...prev, newTask]);
        setNewTaskTitle("");
        setNewTaskDescription("");
    };

    const handleDeleteTask = (idToDelete) => {
        const updatedTasks = tasks
            .filter(task => task.id !== idToDelete)
            .map((task, index) => ({ ...task, id: index + 1 }));
        setTasks(updatedTasks);
    };

    useEffect(() => {
        const fetchData = async () => {
            const manager = await getManager();
            const email = await getUserEmail(manager);
            setManagerEmail(email);
            const researchers = await getAllResearchersByManager(manager);
            setResearchersData(researchers || []);
        };
        fetchData();
    }, []);

    const getResearchers = async () => {
        const data = await getAllResearchersByManager(getManager());
        setResearchersData(data || []);
    };

    useEffect(() => {
        getResearchers();
    }, []);

    const filteredResearchers = researchersData.filter(r =>
        r.name.toLowerCase().includes(search.toLowerCase())
    );

    const handleResearcherToggle = (id) => {
        setSelectedResearchers(prev =>
            prev.includes(id)
                ? prev.filter(rid => rid !== id)
                : [...prev, id]
        );
    };

    // const handleExportToTxt = () => {
    //     const missingFields = [];

    //     if (!projectTitle.trim()) missingFields.push("Título do Projeto");
    //     if (!budget.trim()) missingFields.push("Verba");
    //     if (selectedResearchers.length === 0) missingFields.push("Pesquisadores");
    //     if (tasks.length === 0) missingFields.push("Tarefas");

    //     if (missingFields.length > 0) {
    //         const message = `Você não preencheu os seguintes campos:\n\n- ${missingFields.join("\n- ")}\n\nDeseja exportar mesmo assim?`;
    //         const proceed = window.confirm(message);
    //         if (!proceed) return;
    //     }

    //     const selectedNames = researchersData
    //         .filter(r => selectedResearchers.includes(r.id))
    //         .map(r => `- ${r.name}`)
    //         .join("\n");

    //     const taskLines = tasks
    //         .map(task => `Tarefa ${task.id}: ${task.title}\nDescrição: ${task.description}`)
    //         .join("\n\n");

    //     const content = `
    //         Título do Projeto: ${projectTitle || "(não preenchido)"}
    //         Responsável: ${managerEmail}

    //         Pesquisadores Selecionados (${selectedResearchers.length}):
    //         ${selectedNames || "(nenhum selecionado)"}

    //         Verba disponível: R$ ${budget || "(não preenchido)"}

    //         Tarefas (${tasks.length}):
    //         ${taskLines || "(nenhuma tarefa adicionada)"}
    //         `.trim();

    //     const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
    //     const url = URL.createObjectURL(blob);

    //     const a = document.createElement("a");
    //     a.href = url;
    //     a.download = `${projectTitle || "projeto"}.txt`;
    //     a.click();
    //     URL.revokeObjectURL(url);
    // };

    const handleExportToPdf = () => {
        const fields = [];

        if (!projectTitle.trim()) fields.push("Título do Projeto");
        if (!budget.trim()) fields.push("Verba");
        if (selectedResearchers.length === 0) fields.push("Pesquisadores");
        if (tasks.length === 0) fields.push("Tarefas");

        if (fields.length > 0 && !continueExport) {
            setMissingFields(fields);
            setShowConfirmation(true);
            return;
        }

        setShowConfirmation(false);
        setContinueExport(false);

        exportPdf();
    };


    const exportPdf = async () => {
        try {
            // const ganttNode = document.getElementById("gantt-chart-container");
            // if (!ganttNode) throw new Error("Elemento do gráfico Gantt não encontrado.");

            // const imageDataUrl = await htmlToImage.toPng(ganttNode, {
            //     // cacheBust: true,
            //     // backgroundColor: "#ffffff",
            //     width: ganttNode.scrollWidth,
            //     height: ganttNode.scrollHeight,
            //     pixelRatio: 2,
            // });

            const pdf = new jsPDF({
                orientation: "portrait",
                unit: "px",
                format: "a4",
            });

            const pageWidth = pdf.internal.pageSize.getWidth();
            const margin = 40;
            let y = margin;

            const selectedNames = researchersData
                .filter(r => selectedResearchers.includes(r.id))
                .map(r => `- ${r.name}`)
                .join("\n");

            const taskLines = tasks
                .map(task =>
                    `Tarefa ${task.id}: ${task.title}\nDescrição: ${task.description || "Sem descrição"}`
                )
                .join("\n\n");

            // Title
            pdf.setFillColor(41, 128, 185);
            pdf.setTextColor(255, 255, 255);
            pdf.setFontSize(20);
            pdf.rect(0, y - 10, pageWidth, 40, "F");
            pdf.text(projectTitle || "Projeto sem título", pageWidth / 2, y + 15, { align: "center" });
            y += 50;

            pdf.setTextColor(0, 0, 0);
            pdf.setFontSize(12);
            pdf.text(`Responsável: ${managerEmail}`, margin, y);
            y += 20;
            pdf.text(`Verba disponível: R$ ${budget || "(não preenchido)"}`, margin, y);
            y += 30;

            // reseachers
            pdf.setFontSize(14);
            pdf.text(" Pesquisadores Selecionados:", margin, y);
            y += 20;
            pdf.setFontSize(11);
            pdf.setFont("courier", "normal");
            pdf.text(selectedNames || "(nenhum selecionado)", margin + 10, y);
            y += selectedResearchers.length * 14 + 20;

            // tasks
            pdf.setFontSize(14);
            pdf.setFont("helvetica", "bold");
            pdf.text(" Tarefas:", margin, y);
            y += 20;
            pdf.setFont("courier", "normal");
            pdf.setFontSize(11);
            pdf.text(taskLines || "(nenhuma tarefa adicionada)", margin + 10, y);
            y += tasks.length * 28 + 30;

            // Gantt chart (new page)
            // pdf.addPage();
            // pdf.setFont("helvetica", "bold");
            // pdf.setFontSize(14);
            // pdf.text(" Gráfico Gantt:", margin, 30);

            // const imgProps = pdf.getImageProperties(imageDataUrl);
            // const pdfWidth = pageWidth - 2 * margin;
            // const imgHeight = (imgProps.height * pdfWidth) / imgProps.width;
            // pdf.addImage(imageDataUrl, "PNG", margin, 50, pdfWidth, imgHeight);

            // footer
            const dataHoje = new Date().toLocaleDateString();
            pdf.setFontSize(10);
            pdf.setTextColor(150);
            pdf.text(`Gerado em: ${dataHoje}`, pageWidth - margin, pdf.internal.pageSize.getHeight() - 20, { align: "right" });

            pdf.save(`${projectTitle || "projeto"}.pdf`);
        } catch (error) {
            console.error("Erro ao exportar PDF:", error);
            alert("Erro ao exportar. Veja o console.");
        }
    };


    const updateTask = (taskId, updatedFields) => {
        setTasks(prevTasks =>
            prevTasks.map(task =>
                task.id === taskId ? { ...task, ...updatedFields } : task
            )
        );
    };

    return (
        <div className="font-sans p-6 overflow-x-hidden">
            <header className="mb-8">
                <input
                    type="text"
                    placeholder="Digite o título do projeto"
                    value={projectTitle}
                    onChange={e => setProjectTitle(e.target.value)}
                    className="text-2xl font-bold border-b-2 border-gray-300 w-full mb-2 py-1 focus:outline-none"
                />
                <p className="text-gray-600">Responsável: {managerEmail}</p>
            </header>

            <div className="grid grid-cols-2 gap-8">
                <section>
                    <h2 className="text-lg font-semibold mb-2">Researchers</h2>
                    <input
                        type="text"
                        placeholder="Search researchers..."
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                        className="w-full mb-3 p-2 border rounded"
                    />
                    <div className="max-h-40 overflow-y-auto border border-gray-200 rounded p-2">
                        {filteredResearchers.map(r => (
                            <label
                                key={r.id}
                                className="flex items-center gap-3 p-2 rounded hover:bg-gray-100 transition-colors duration-200 cursor-pointer text-sm sm:text-base"
                            >
                                <input
                                    type="checkbox"
                                    checked={selectedResearchers.includes(r.id)}
                                    onChange={() => handleResearcherToggle(r.id)}
                                    className="h-5 w-5 shrink-0 appearance-none border border-gray-400 rounded-sm checked:bg-blue-500 checked:border-transparent focus:outline-none transition duration-200"
                                />
                                <span className="text-gray-800 break-words">{r.name}</span>
                            </label>
                        ))}
                    </div>
                    <div className="mt-2 font-medium">
                        <strong>Selected:</strong> {selectedResearchers.length}
                    </div>
                </section>

                <section>
                    <h2 className="text-lg font-semibold mb-2">Verba</h2>
                    <input
                        type="number"
                        placeholder="Digite a verba disponível"
                        value={budget}
                        onChange={e => setBudget(e.target.value)}
                        className="w-full p-2 border rounded"
                        min={0}
                    />
                </section>

                <section>
                    <h2 className="text-lg font-semibold mb-2">Tarefas</h2>

                    <input
                        type="text"
                        placeholder="Título da tarefa"
                        value={newTaskTitle}
                        onChange={e => setNewTaskTitle(e.target.value)}
                        className="w-full mb-2 p-2 border rounded"
                    />

                    <textarea
                        placeholder="Descrição da tarefa"
                        value={newTaskDescription}
                        onChange={e => setNewTaskDescription(e.target.value)}
                        className="w-full mb-2 p-2 border rounded h-20"
                    />

                    <button
                        onClick={handleAddTask}
                        className="mb-4 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                    >
                        Adicionar Tarefa
                    </button>

                    <div>
                        {tasks.map((task) => (
                            <div key={task.id} className="mb-3 p-3 rounded relative">
                                <strong>Tarefa {task.id}: {task.title}</strong>
                                <p>{task.description}</p>

                                <label className="block mt-2">
                                    Data início:
                                    <input
                                        type="date"
                                        value={task.startDate ? task.startDate.toISOString().substring(0, 10) : ""}
                                        onChange={e => updateTask(task.id, { startDate: e.target.value ? new Date(e.target.value) : null })}
                                        className="ml-2 border rounded px-2"
                                    />
                                </label>

                                <label className="block mt-2">
                                    Duração (dias):
                                    <input
                                        type="number"
                                        min={1}
                                        value={task.duration || 1}
                                        onChange={e => updateTask(task.id, { duration: Math.max(1, Number(e.target.value)) })}
                                        className="ml-2 border rounded px-2 w-16"
                                    />
                                </label>

                                <button
                                    onClick={() => handleDeleteTask(task.id)}
                                    className="absolute top-2 right-2 bg-red-600 text-white rounded px-2 py-1 hover:bg-red-700"
                                    aria-label={`Deletar tarefa ${task.title}`}
                                >
                                    ✕
                                </button>
                            </div>
                        ))}
                    </div>
                </section>

                <section className="col-span-2 mt-8">
                    <h1 className="font-bold mb-2 text-xl">Gantt Chart</h1>
                    <div className="mb-4">
                        <h3><strong>Título do projeto:</strong> {projectTitle || "Sem título"}</h3>
                        <p><strong>Responsável:</strong> {managerEmail}</p>
                        <p><strong>Verba:</strong> R$ {budget}</p>
                    </div>
                    <div id="gantt-chart-container">
                        <GanttChart tasks={tasks} />
                    </div>
                </section>


                <section>
                    <button
                        onClick={handleExportToPdf}
                        className="mt-4 px-6 py-2 bg-blue-700 text-white rounded hover:bg-blue-800"
                    >
                        Exportar como PDF
                    </button>

                </section>
                {showConfirmation && (
                    <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
                        <div className="bg-white rounded-lg p-6 max-w-md w-full shadow-lg">
                            <h2 className="text-xl font-semibold mb-4 text-red-600">Campos obrigatórios não preenchidos</h2>
                            <p className="mb-4">Você não preencheu os seguintes campos:</p>
                            <ul className="mb-4 list-disc list-inside text-sm text-gray-700">
                                {missingFields.map((field, idx) => <li key={idx}>{field}</li>)}
                            </ul>
                            <p className="mb-4">Deseja exportar o PDF mesmo assim?</p>
                            <div className="flex justify-end gap-4">
                                <button
                                    onClick={() => setShowConfirmation(false)}
                                    className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
                                >
                                    Cancelar
                                </button>
                                <button
                                    onClick={() => {
                                        setContinueExport(true);
                                        handleExportToPdf();
                                    }}
                                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                                >
                                    Sim, continuar
                                </button>
                            </div>
                        </div>
                    </div>
                )}


                {/* <section>
                    <button
                        onClick={handleExportToTxt}
                        className="mt-4 px-6 py-2 bg-blue-700 text-white rounded hover:bg-blue-800"
                    >
                        Exportar informações como TXT
                    </button>
                </section> */}
            </div>
        </div>
    );
}
