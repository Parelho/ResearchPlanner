import { supabase } from "./supabaseClient.js";

export async function saveResearcher(manager, name, description, skills, cost) {
    try {
        const { data, error } = await supabase
            .from("researchers")
            .insert([{ manager, name, description, skills, cost }]);

        if (error) {
            console.error("Error adding researcher:", error.message);
            return false;
        }

        return true;
    } catch (err) {
        console.error("Unexpected error while adding researcher:", err);
        return false;
    }
}

export async function getAllResearchersByManager(manager) {
    try {
        const { data, error } = await supabase
            .from("researchers")
            .select("id, name, description, skills, cost")
            .eq("manager", manager);

        if (error) {
            console.error("Error fetching researchers:", error.message);
            return [];
        }

        // console.log(data)

        return data || [];
    } catch (err) {
        console.error("Unexpected error fetching researchers:", err);
        return [];
    }
}

export async function deleteResearcher(id) {
    try {
        const { data, error } = await supabase
            .from("researchers")
            .delete()
            .eq("id", id);

        if (error) {
            console.error("Error deleting researcher:", error.message);
            return false;
        }

        return true;
    } catch (err) {
        console.error("Unexpected error deleting researcher:", err);
        return false;
    }
}

