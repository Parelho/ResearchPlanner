import { supabase } from "./supabaseClient.js";

// Adiciona um projeto ao Supabase
export async function addProject(projectData) {
  const { data, error } = await supabase
    .from("projects")
    .insert([projectData]);

  if (error) {
    console.error("Erro ao adicionar projeto:", error);
    throw error;
  }

  return data;
}

// Remove um projeto do Supabase pelo ID
export async function removeProject(projectId) {
  const { data, error } = await supabase
    .from("projects")
    .delete()
    .eq("id", projectId);

  if (error) {
    console.error("Erro ao remover projeto:", error);
    throw error;
  }

  return data;
}
