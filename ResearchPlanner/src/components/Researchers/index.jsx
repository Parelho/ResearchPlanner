import React, { useState, useEffect } from "react";
import { saveResearcher, getAllResearchersByManager, deleteResearcher } from "../../data/researcher";
import { getManager } from "../../data/managerStore.js";

export default function Researchers() {
    const [researcherName, setResearcherName] = useState("");
    const [description, setDescription] = useState("");
    const [skills, setSkills] = useState("");
    const [cost, setCost] = useState(0);
    const [researchersData, setResearchersData] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [missingFields, setMissingFields] = useState([]);

    const handleSubmit = async () => {
        const missing = [];
        if (!researcherName.trim()) missing.push("Nome do pesquisador");
        if (!description.trim()) missing.push("Descrição");
        if (!skills.trim()) missing.push("Habilidades");

        if (missing.length > 0) {
            setMissingFields(missing);
            setShowModal(true);
            return;
        }

        const skillsDB = skills
            .split(",")
            .map((skill) => skill.trim())
            .filter((skill) => skill.length > 0);

        const manager = getManager();

        const success = await saveResearcher(manager, researcherName, description, skillsDB, cost);
        if (success) {
            console.log("Saved successfully!");
            getResearchers();
            // limpa os campos
            setResearcherName("");
            setDescription("");
            setSkills("");
            setCost(0);
        } else {
            console.error("Save failed.");
        }
    };

    const handleDelete = async (id) => {
        const success = await deleteResearcher(id);
        if (success) {
            console.log("Deleted successfully!");
            getResearchers();
        } else {
            console.error("Delete failed.");
        }
    };

    const getResearchers = async () => {
        const data = await getAllResearchersByManager(getManager());
        setResearchersData(data);
    };

    useEffect(() => {
        getResearchers();
    }, []);

    return (
        <div className="p-4 space-y-4">
            <div>
                <h1 className="text-2xl font-bold">Adicionar novo pesquisador</h1>

                <h2 className="text-xl">
                    Nome do pesquisador
                    <input
                        name="researcherName"
                        value={researcherName}
                        onChange={(e) => setResearcherName(e.target.value)}
                        className="block mt-1 p-2 border rounded"
                    />
                </h2>

                <h2 className="text-xl">
                    Descrição
                    <input
                        name="description"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        className="block mt-1 p-2 border rounded"
                    />
                </h2>

                <h2 className="text-xl">
                    Habilidades
                    <input
                        name="skills"
                        value={skills}
                        onChange={(e) => setSkills(e.target.value)}
                        className="block mt-1 p-2 border rounded w-full"
                    />
                </h2>

                <h2 className="text-xl">
                    Valor Hora
                    <input
                        type="number"
                        name="cost"
                        value={cost}
                        onChange={(e) => setCost(e.target.value)}
                        className="block mt-1 p-2 border rounded w-full"
                        step="1"
                        min="0"
                    />
                </h2>

                <button
                    onClick={handleSubmit}
                    className="mt-6 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                    Adicionar
                </button>
            </div>

            <div>
                <h1 className="text-2xl font-bold">Pesquisadores registrados</h1>
                {researchersData.length > 0 ? (
                    <ul className="space-y-4 mt-4">
                        {researchersData.map((researcher) => (
                            <li key={researcher.id} className="p-4 border rounded shadow">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <h3 className="text-xl font-semibold">{researcher.name}</h3>
                                        <p className="text-gray-700">{researcher.description}</p>
                                        <p className="text-gray-600">
                                            <strong>Habilidades:</strong> {researcher.skills.join(", ")}
                                        </p>
                                        <p className="text-gray-600">
                                            <strong>Custo: R$</strong> {researcher.cost} a hora
                                        </p>
                                    </div>
                                    <button
                                        onClick={() => handleDelete(researcher.id)}
                                        className="ml-4 px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700"
                                    >
                                        Deletar
                                    </button>
                                </div>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p className="mt-2 text-gray-500">Nenhum pesquisador registrado ainda.</p>
                )}
            </div>

            {/* MODAL */}
            {showModal && (
                <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
                    <div className="bg-white rounded-lg p-6 max-w-md w-full shadow-lg">
                        <h2 className="text-xl font-semibold mb-4 text-red-600">Campos obrigatórios não preenchidos</h2>
                        <p className="mb-4">Você não preencheu os seguintes campos:</p>
                        <ul className="mb-4 list-disc list-inside text-sm text-gray-700">
                            {missingFields.map((field, idx) => <li key={idx}>{field}</li>)}
                        </ul>
                        <div className="flex justify-end">
                            <button
                                onClick={() => setShowModal(false)}
                                className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
                            >
                                Fechar
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
