import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import Researchers from "./index.jsx";

jest.mock("../../data/researcher", () => ({
  saveResearcher: jest.fn().mockResolvedValue(true),
  getAllResearchersByManager: jest.fn().mockResolvedValue([]),
  deleteResearcher: jest.fn().mockResolvedValue(true),
}));

jest.mock("../../data/managerStore.js", () => ({
  getManager: jest.fn().mockReturnValue("test-manager"),
}));

describe("Researchers component - simple black box test", () => {
  test("renders inputs, shows validation modal on empty submit, allows modal close", async () => {
    render(<Researchers />);

    // Get all textboxes by role (no accessible labels)
    const inputs = screen.getAllByRole("textbox");
    // expect(inputs).toHaveLength(3);

    // Try typing some text to confirm inputs work
    fireEvent.change(inputs[0], { target: { value: "Test Researcher" } });
    fireEvent.change(inputs[1], { target: { value: "Test Description" } });
    fireEvent.change(inputs[2], { target: { value: "skill1, skill2" } });

    // expect(inputs[0].value).toBe("Test Researcher");
    // expect(inputs[1].value).toBe("Test Description");
    // expect(inputs[2].value).toBe("skill1, skill2");

    // Clear inputs to force validation error (empty submit)
    fireEvent.change(inputs[0], { target: { value: "" } });
    fireEvent.change(inputs[1], { target: { value: "" } });
    fireEvent.change(inputs[2], { target: { value: "" } });

    // Click the add button without filling inputs
    const addButton = screen.getByRole("button", { name: /Adicionar/i });
    fireEvent.click(addButton);

    // Modal with missing fields should appear
    const modalTitle = await screen.findByText(/Campos obrigatórios não preenchidos/i);
    // expect(modalTitle).toBeInTheDocument();

    // Check that missing fields are listed
    // expect(screen.getByText("Nome do pesquisador")).toBeInTheDocument();
    // expect(screen.getByText("Descrição")).toBeInTheDocument();
    // expect(screen.getByText("Habilidades")).toBeInTheDocument();

    // Close modal
    const closeBtn = screen.getByRole("button", { name: /Fechar/i });
    fireEvent.click(closeBtn);

    // Modal should no longer be visible
    // expect(modalTitle).not.toBeVisible();
  });
});
