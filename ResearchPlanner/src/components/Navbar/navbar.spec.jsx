import { render } from '@testing-library/react';
import Home from "./index";
import React from 'react';

test('Names rendered in sidebar', () => {
    const { getByText } = render(<Home />);

    expect(getByText("Pesquisadores")).toBeTruthy();
    expect(getByText("Perfil")).toBeTruthy();
    expect(getByText("Logout")).toBeTruthy();
});