import React, { useEffect, useState } from "react";
import { supabase } from "../../data/supabaseClient.js";
import { getManager } from "../../data/managerStore.js";
import { getUserEmail } from "../../data/user.js";

export default function EditProjects() {
  const [manager, setManager] = useState(null);
  const [managerEmail, setManagerEmail] = useState("");
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);

  // Estado para controlar modal de exclusão
  const [projectToDelete, setProjectToDelete] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const currentManager = await getManager();
        setManager(currentManager);
        const email = await getUserEmail(currentManager);
        setManagerEmail(email);

        const { data, error } = await supabase
          .from("projects")
          .select("*")
          .eq("manager", currentManager);

        if (error) {
          console.error("Erro ao buscar projetos:", error);
        } else {
          const projectsWithTasks = data.map(p => ({
            ...p,
            tasks: p.tasks || [],
          }));
          setProjects(projectsWithTasks);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleTitleChange = (projectId, newTitle) => {
    setProjects(prev =>
      prev.map(p => (p.id === projectId ? { ...p, title: newTitle } : p))
    );
  };

  const handleAddTask = (projectId) => {
    setProjects(prev =>
      prev.map(p => {
        if (p.id === projectId) {
          const newTask = {
            id: Date.now(),
            title: "",
            description: "",
            startDate: null,
            duration: 1,
          };
          return { ...p, tasks: [...p.tasks, newTask] };
        }
        return p;
      })
    );
  };

  const handleTaskChange = (projectId, taskId, field, value) => {
    setProjects(prev =>
      prev.map(p => {
        if (p.id === projectId) {
          const updatedTasks = p.tasks.map(t =>
            t.id === taskId ? { ...t, [field]: value } : t
          );
          return { ...p, tasks: updatedTasks };
        }
        return p;
      })
    );
  };

  const handleRemoveTask = (projectId, taskId) => {
    setProjects(prev =>
      prev.map(p => {
        if (p.id === projectId) {
          const filteredTasks = p.tasks.filter(t => t.id !== taskId);
          return { ...p, tasks: filteredTasks };
        }
        return p;
      })
    );
  };

  const handleSave = async (project) => {
    setSaving(true);
    try {
      const { error } = await supabase
        .from("projects")
        .update({
          title: project.title,
          tasks: project.tasks,
        })
        .eq("id", project.id);

      if (error) {
        console.log("Erro ao salvar projeto: " + error.message);
      } else {
        console.log("Projeto salvo com sucesso!");
      }
    } catch (err) {
      console.log("Erro inesperado: " + err.message);
    } finally {
      setSaving(false);
    }
  };

  const confirmDelete = async () => {
    if (!projectToDelete) return;

    setDeleting(true);
    try {
      const { error } = await supabase
        .from("projects")
        .delete()
        .eq("id", projectToDelete.id);

      if (error) {
        console.log("Erro ao excluir projeto: " + error.message);
      } else {
        console.log("Projeto excluído com sucesso!");
        setProjects(prev => prev.filter(p => p.id !== projectToDelete.id));
        setProjectToDelete(null);
      }
    } catch (err) {
      console.log("Erro inesperado: " + err.message);
    } finally {
      setDeleting(false);
    }
  };

  if (loading) return <p className="p-8 text-center">Carregando projetos...</p>;

  return (
    <div className="min-h-screen bg-white p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-8 text-center text-gray-800">
          Editar Projetos do {managerEmail || "Gerente"}
        </h1>

        {projects.length === 0 && (
          <p className="text-center text-gray-600">Nenhum projeto encontrado.</p>
        )}

        {projects.map(project => (
          <div
            key={project.id}
            className="bg-gray-100 p-6 rounded-lg shadow mb-8 border-[6px] border-black"

          >
            <div className="mb-4">
              <label className="block font-semibold mb-1" htmlFor={`title-${project.id}`}>
                Título do Projeto
              </label>
              <input
                id={`title-${project.id}`}
                type="text"
                value={project.title}
                onChange={e => handleTitleChange(project.id, e.target.value)}
                className="w-full border rounded px-3 py-2"
              />
            </div>

            <div>
              <h3 className="font-semibold mb-2">Tarefas</h3>
              {project.tasks.length === 0 && (
                <p className="italic text-gray-600 mb-2">Nenhuma tarefa cadastrada.</p>
              )}

              {project.tasks.map(task => (
                <div
                  key={task.id}
                  className="border rounded p-3 mb-3 bg-gray-50 relative"
                >
                  <button
                    onClick={() => handleRemoveTask(project.id, task.id)}
                    className="absolute top-2 right-2 text-red-600 hover:text-red-800 font-bold"
                    title="Excluir tarefa"
                    type="button"
                  >
                    &times;
                  </button>

                  <label className="block font-semibold mt-1" htmlFor={`task-title-${task.id}`}>
                    Título
                  </label>
                  <input
                    id={`task-title-${task.id}`}
                    type="text"
                    value={task.title}
                    onChange={e =>
                      handleTaskChange(project.id, task.id, "title", e.target.value)
                    }
                    className="w-full border rounded px-2 py-1"
                  />

                  <label className="block font-semibold mt-2" htmlFor={`task-desc-${task.id}`}>
                    Descrição
                  </label>
                  <textarea
                    id={`task-desc-${task.id}`}
                    value={task.description}
                    onChange={e =>
                      handleTaskChange(project.id, task.id, "description", e.target.value)
                    }
                    className="w-full border rounded px-2 py-1"
                  />

                  <label className="block font-semibold mt-2" htmlFor={`task-start-${task.id}`}>
                    Data Início
                  </label>
                  <input
                    id={`task-start-${task.id}`}
                    type="date"
                    value={task.startDate ? task.startDate.slice(0,10) : ""}
                    onChange={e =>
                      handleTaskChange(project.id, task.id, "startDate", e.target.value)
                    }
                    className="w-full border rounded px-2 py-1"
                  />

                  <label className="block font-semibold mt-2" htmlFor={`task-duration-${task.id}`}>
                    Duração (dias)
                  </label>
                  <input
                    id={`task-duration-${task.id}`}
                    type="number"
                    min={1}
                    value={task.duration || 1}
                    onChange={e =>
                      handleTaskChange(project.id, task.id, "duration", Number(e.target.value))
                    }
                    className="w-full border rounded px-2 py-1"
                  />
                </div>
              ))}

              <button
                onClick={() => handleAddTask(project.id)}
                className="mt-2 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                type="button"
              >
                + Adicionar tarefa
              </button>
            </div>

            <div className="flex gap-4 mt-4">
              <button
                onClick={() => handleSave(project)}
                disabled={saving}
                className={`flex-1 px-6 py-2 rounded text-white ${
                  saving ? "bg-gray-400 cursor-not-allowed" : "bg-green-600 hover:bg-green-700"
                }`}
                type="button"
              >
                {saving ? "Salvando..." : "Salvar Projeto"}
              </button>

              <button
                onClick={() => setProjectToDelete(project)}
                disabled={deleting}
                className={`flex-1 px-6 py-2 rounded text-white ${
                  deleting ? "bg-gray-400 cursor-not-allowed" : "bg-red-600 hover:bg-red-700"
                }`}
                type="button"
              >
                {deleting ? "Excluindo..." : "Excluir Projeto"}
              </button>
            </div>
          </div>
        ))}

        {/* Modal de confirmação */}
        {projectToDelete && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="bg-white rounded-lg shadow-lg p-6 max-w-sm w-full">
              <h2 className="text-xl font-semibold mb-4">Confirmar exclusão</h2>
              <p className="mb-6">
                Tem certeza que deseja excluir o projeto <strong>{projectToDelete.title}</strong>? Esta ação não pode ser desfeita.
              </p>
              <div className="flex justify-end gap-4">
                <button
                  onClick={() => setProjectToDelete(null)}
                  className="px-4 py-2 rounded bg-gray-300 hover:bg-gray-400"
                  type="button"
                  disabled={deleting}
                >
                  Cancelar
                </button>
                <button
                  onClick={confirmDelete}
                  className="px-4 py-2 rounded bg-red-600 text-white hover:bg-red-700"
                  type="button"
                  disabled={deleting}
                >
                  {deleting ? "Excluindo..." : "Excluir"}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
