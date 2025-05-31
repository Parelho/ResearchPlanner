import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import Login from "./index.jsx";
import "@testing-library/jest-dom";

jest.mock("../../data/user.js", () => ({
  validateLogin: jest.fn().mockResolvedValue(false),
  addUser: jest.fn().mockResolvedValue(true),
}));

describe("Login component - white box test", () => {
  test("shows error if login fields are empty", async () => {
    render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>
    );

    const loginButton = screen.getByRole("button", { name: /login/i });
    fireEvent.click(loginButton);

    expect(await screen.findByText(/please fill in all fields/i)).toBeInTheDocument();
  });

  test("shows error if signup passwords don't match", async () => {
    render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>
    );

    const emailInputs = screen.getAllByPlaceholderText("Email");
    const passwordInputs = screen.getAllByPlaceholderText("Password");
    const confirmInput = screen.getByPlaceholderText("Confirm Password");

    const signupEmail = emailInputs[1];      // second one is for signup
    const signupPassword = passwordInputs[1]; // second one is for signup

    fireEvent.change(signupEmail, { target: { value: "test@example.com" } });
    fireEvent.change(signupPassword, { target: { value: "123456" } });
    fireEvent.change(confirmInput, { target: { value: "654321" } });

    const signupButton = screen.getByRole("button", { name: /sign up/i });
    fireEvent.click(signupButton);

    expect(await screen.findByText(/passwords do not match/i)).toBeInTheDocument();
  });
});
