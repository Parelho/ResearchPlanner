import { supabase } from "./supabaseClient.js";

export async function saveResearcher(manager, name, description, skills) {
    try {
        console.log(manager)

        const { data, error } = await supabase
            .from("researchers")
            .insert([{ manager, name, description, skills }]);

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

