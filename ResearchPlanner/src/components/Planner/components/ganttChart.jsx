import React from "react";
import { Gantt, ViewMode } from "gantt-task-react";
import "gantt-task-react/dist/index.css";

export default function GanttChart({ tasks }) {
  if (!tasks || tasks.length === 0) {
    return (
      <div className="p-6 bg-gray-100 rounded-lg border border-dashed text-gray-500 italic text-center">
        Sem tarefas para exibir.
      </div>
    );
  }

  const formattedTasks = tasks.map((task) => {
    const start = task.startDate ? new Date(task.startDate) : new Date();
    const end = new Date(start);
    end.setDate(start.getDate() + (task.duration || 1));

    return {
      id: `${task.id}`,
      name: task.title,
      start,
      end,
      type: "task",
      progress: 0,
      isDisabled: false,
    };
  });

  return (
    <div
      className="w-full max-w-full overflow-x-auto bg-white shadow-md rounded-xl p-4 bg-gray-50"
      // style={{ backgroundColor: "#fff" }}
    >

      <div className="min-w-[600px]">
        <Gantt
          tasks={formattedTasks}
          viewMode={ViewMode.Day}
          locale="pt-BR"
          listCellWidth="0"  
          TaskListHeader={() => (null)}
          columnWidth={60}
          fontSize="12px"
          rowHeight={40}
          barCornerRadius={5}
          todayColor="#f48fb1"
          barBackgroundColor="#90caf9"
          barProgressColor="#1976d2"
          barBackgroundSelectedColor="#64b5f6"
          barProgressSelectedColor="#0d47a1"
          arrowColor="#999"
          style={{ background: "#fff" }}
        />
      </div>
    </div>
  );
}
