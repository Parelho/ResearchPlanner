import { supabase } from "./supabaseClient.js";
import { setManager } from "./managerStore.js";

export async function validateLogin(email, password) {
    try {
        const { data, error } = await supabase
            .from("users")
            .select("*")
            .eq("email", email)
            .eq("password", password)
        // .single();

        if (error || !data) {
            console.error("Login failed:", error?.message || "No matching user");
            return false;
        }

        setManager(data[0].id);
        // console.log(data[0].id);

        return true;
    } catch (err) {
        console.error("Unexpected error during login:", err);
        return false;
    }
}

export async function addUser(email, password) {
    try {
        const { data, error } = await supabase
            .from("users")
            .insert([{ email, password }]);

        console.log("Inserted data:", data); // Log de dados inseridos
        console.log("Error:", error); // Log de erros

        if (error) {
            console.error("Error adding user:", error.message);
            return false;
        }

        return true;
    } catch (err) {
        console.error("Unexpected error while adding user:", err);
        return false;
    }
}

export async function getUserEmail(managerID) {
    try {
        const { data, error } = await supabase
            .from("users")
            .select("email")
            .eq("id", managerID)
            .single();

        if (error) {
            console.error("Error getting user email:", error.message);
            return null;
        }

        return data ? data.email : null;
    } catch (err) {
        console.error("Unexpected error while getting user email:", err);
        return null;
    }
}
