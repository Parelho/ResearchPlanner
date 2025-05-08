import React, { useState } from "react";
import { saveResearcher } from "../../data/researcher";
import { getManager } from "../../data/managerStore.js";

export default function Researchers() {
    const [researcherName, setResearcherName] = useState("");
    const [description, setDescription] = useState("");
    const [skills, setSkills] = useState("");

    const handleSubmit = async () => {
        const skillsArray = skills
            .split(",")
            .map((skill) => skill.trim())
            .filter((skill) => skill.length > 0);

        var manager = getManager();

        const success = await saveResearcher(manager, researcherName, description, skillsArray);
        if (success) {
            console.log("Saved successfully!");
        } else {
            console.error("Save failed.");
        }
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

            <label className="block text-xl">
                Habilidades
                <input
                    name="skills"
                    value={skills}
                    onChange={(e) => setSkills(e.target.value)}
                    className="block mt-1 p-2 border rounded w-full"
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
