import React, { useState } from "react";

export default function Researchers() {
    const [researcherName, setResearcherName] = useState("");
    const [description, setDescription] = useState("");

    const handleSubmit = () => {
        console.log("Researcher Name: ", researcherName);
        console.log("Description: ", description);
    };

    return (
        <div className="p-4 space-y-4">
            <label className="block text-xl">
                Nome do pesquisador
                <input
                    name="researcherName"
                    value={researcherName}
                    onChange={(e) => setResearcherName(e.target.value)}
                    className="block mt-1 p-2 border rounded"
                />
            </label>

            <label className="block text-xl">
                Descrição
                <input
                    name="description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="block mt-1 p-2 border rounded"
                />
            </label>

            <button
                onClick={handleSubmit}
                className="mt-6 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
                Salvar Informações
            </button>
        </div>
    );
}
