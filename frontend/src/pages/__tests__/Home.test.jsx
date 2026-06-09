import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Home from '../Home';

describe('S033: Home Page Rendering Tests', () => {
  test('Debe renderizar la sección de bienvenida con el título correcto', () => {
    render(
      <MemoryRouter>
        <Home />
      </MemoryRouter>
    );

    // Buscar el título principal
    expect(screen.getAllByText(/Soporte/i).length).toBeGreaterThan(0);
    expect(screen.getByText(/Eficiente/i)).toBeInTheDocument();
    expect(screen.getByText(/para tus Equipos/i)).toBeInTheDocument();

    // Buscar la descripción
    expect(
      screen.getByText(/Sistema de gestión de incidencias técnicas de Soft Corporation/i)
    ).toBeInTheDocument();
  });

  test('Debe renderizar los botones de navegación', () => {
    render(
      <MemoryRouter>
        <Home />
      </MemoryRouter>
    );

    const btnRegistrar = screen.getByRole('link', { name: /Registrar Incidencia/i });
    const btnBandeja = screen.getByRole('link', { name: /Bandeja Jefatura de Soporte/i });

    expect(btnRegistrar).toBeInTheDocument();
    expect(btnRegistrar).toHaveAttribute('href', '/nueva-incidencia');
    expect(btnBandeja).toBeInTheDocument();
    expect(btnBandeja).toHaveAttribute('href', '/bandeja');
  });

  test('Debe renderizar las secciones de beneficios y contacto', () => {
    render(
      <MemoryRouter>
        <Home />
      </MemoryRouter>
    );

    expect(screen.getByText('Beneficios del Servicio')).toBeInTheDocument();
    expect(screen.getByText('Atención Rápida')).toBeInTheDocument();
    expect(screen.getByText('Reparación Local')).toBeInTheDocument();
    expect(screen.getByText('Equipos Confiables')).toBeInTheDocument();
    expect(screen.getByText(/Comunícate/i)).toBeInTheDocument();
  });
});
