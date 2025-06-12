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

    useEffect(() => {
        if (researcherName.length > 50) {
            setResearcherName(researcherName.slice(0, 50));
        }
    }, [researcherName])

    return (
        <div className="p-4 space-y-4">
            <div className="p-4 max-w-8xl mx-auto">
                <div className="p-1 rounded-2xl bg-gray-900 shadow-lg">
                    <div className="p-6 rounded-xl bg-gray-100">

                        <h1 className="text-3xl font-bold text-gray-900 mb-6">Adicionar novo pesquisador</h1>

                        <div className="space-y-4">

                            <div>
                                <label className="block text-gray-700 text-lg mb-1" htmlFor="researcherName">
                                    Nome do pesquisador
                                </label>
                                <input
                                    id="researcherName"
                                    name="researcherName"
                                    value={researcherName}
                                    onChange={(e) => setResearcherName(e.target.value)}
                                    className="w-1/3 p-3 rounded-xl bg-white text-gray-900 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>

                            <div>
                                <label className="block text-gray-700 text-lg mb-1" htmlFor="description">
                                    Descrição
                                </label>
                                <textarea
                                    id="description"
                                    name="description"
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    className="w-full p-3 rounded-xl bg-white text-gray-900 shadow-sm h-28 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>

                            <div>
                                <label className="block text-gray-700 text-lg mb-1" htmlFor="skills">
                                    Habilidades
                                </label>
                                <textarea
                                    id="skills"
                                    name="skills"
                                    value={skills}
                                    onChange={(e) => setSkills(e.target.value)}
                                    className="w-full p-3 rounded-xl bg-white text-gray-900 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>

                            <div>
                                <label className="block text-gray-700 text-lg mb-1" htmlFor="cost">
                                    Valor Hora
                                </label>
                                <input
                                    type="number"
                                    id="cost"
                                    name="cost"
                                    value={cost}
                                    onChange={(e) => setCost(e.target.value)}
                                    className="w-16 p-3 rounded-xl bg-white text-gray-900 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    step="1"
                                    min="0"
                                />
                            </div>

                            <button
                                onClick={handleSubmit}
                                className="w-full py-3 mt-2 rounded-xl bg-blue-600 text-white font-semibold text-lg hover:bg-blue-700 transition"
                            >
                                Adicionar
                            </button>

                        </div>
                    </div>
                </div>
            </div>

            <div>
                <h1 className="text-2xl font-bold mt-12">Pesquisadores registrados</h1>
                {researchersData.length > 0 ? (
                    <ul className="space-y-4 mt-4">
                        {researchersData.length > 0 ? (
                            <ul className="space-y-6 mt-6">
                                {researchersData.map((researcher) => (
                                    <li
                                        key={researcher.id}
                                        className="p-1 rounded-2xl bg-gray-900 shadow-lg"
                                    >
                                        <div className="p-4 rounded-xl bg-gray-100">
                                            <div className="flex justify-between items-start">
                                                <div>
                                                    <h3 className="text-2xl font-bold text-gray-900">{researcher.name}</h3>
                                                    <p className="mt-2 text-gray-700">{researcher.description}</p>
                                                    <p className="mt-2 text-gray-600">
                                                        <strong>Habilidades:</strong> {researcher.skills.join(", ")}
                                                    </p>
                                                    <p className="mt-2 text-gray-700">
                                                        <strong>Custo:</strong> R$ {researcher.cost} / hora
                                                    </p>
                                                </div>
                                                <button
                                                    onClick={() => handleDelete(researcher.id)}
                                                    className="ml-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
                                                >
                                                    Deletar
                                                </button>
                                            </div>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p className="text-gray-400 mt-4">Nenhum pesquisador encontrado.</p>
                        )}

                    </ul>
                ) : (
                    <p className="mt-2 text-gray-600">Nenhum pesquisador registrado ainda.</p>
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
