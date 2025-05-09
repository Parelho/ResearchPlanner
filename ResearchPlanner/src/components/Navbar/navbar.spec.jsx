// navbar.spec.jsx
import React from "react";
import { render } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import Navbar from "./index";
import '@testing-library/jest-dom';

test("renders Navbar links", () => {
  const { getByText } = render(
    <MemoryRouter>
      <Navbar />
    </MemoryRouter>
  );

  expect(getByText("Home")).toBeInTheDocument();
  expect(getByText("Pesquisadores")).toBeInTheDocument();
});
