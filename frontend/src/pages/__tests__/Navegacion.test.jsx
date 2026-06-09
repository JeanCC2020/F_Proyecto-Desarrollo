import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import Navbar from '../../components/Navbar';

describe('S035: Navigation Tests', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  test('Debe renderizar los enlaces de la barra de navegación para un Jefe de Soporte', () => {
    localStorage.setItem('currentUser', JSON.stringify({ nombre: 'Jefe de Soporte', rol: 'jefe' }));
    localStorage.setItem('token', 'mock-token');

    render(
      <MemoryRouter initialEntries={['/']}>
        <Navbar />
      </MemoryRouter>
    );

    const linkInicio = screen.getByRole('link', { name: /Inicio/i });
    const linkNueva = screen.getByRole('link', { name: /Nueva Incidencia/i });
    const linkBandeja = screen.getByRole('link', { name: /Bandeja/i });
    const linkTareas = screen.queryByRole('link', { name: /Mis Tareas/i });

    expect(linkInicio).toHaveAttribute('href', '/');
    expect(linkNueva).toHaveAttribute('href', '/nueva-incidencia');
    expect(linkBandeja).toHaveAttribute('href', '/bandeja');
    expect(linkTareas).not.toBeInTheDocument();
  });

  test('Debe renderizar los enlaces de la barra de navegación para un Técnico', () => {
    localStorage.setItem('currentUser', JSON.stringify({ nombre: 'Carlos Tecnico', rol: 'tecnico' }));
    localStorage.setItem('token', 'mock-token');

    render(
      <MemoryRouter initialEntries={['/']}>
        <Navbar />
      </MemoryRouter>
    );

    const linkInicio = screen.getByRole('link', { name: /Inicio/i });
    const linkNueva = screen.getByRole('link', { name: /Nueva Incidencia/i });
    const linkBandeja = screen.queryByRole('link', { name: /Bandeja/i });
    const linkTareas = screen.getByRole('link', { name: /Mis Tareas/i });

    expect(linkInicio).toHaveAttribute('href', '/');
    expect(linkNueva).toHaveAttribute('href', '/nueva-incidencia');
    expect(linkBandeja).not.toBeInTheDocument();
    expect(linkTareas).toHaveAttribute('href', '/mis-tareas');
  });

  test('Debe cambiar de ruta al hacer clic en los enlaces de navegación', () => {
    localStorage.setItem('currentUser', JSON.stringify({ nombre: 'Jefe de Soporte', rol: 'jefe' }));
    localStorage.setItem('token', 'mock-token');

    render(
      <MemoryRouter initialEntries={['/']}>
        <Routes>
          <Route path="/" element={<><Navbar /><div>Página Inicio</div></>} />
          <Route path="/nueva-incidencia" element={<div>Página Nueva Incidencia</div>} />
        </Routes>
      </MemoryRouter>
    );

    const linkNueva = screen.getByRole('link', { name: /Nueva Incidencia/i });
    fireEvent.click(linkNueva);

    expect(screen.getByText('Página Nueva Incidencia')).toBeInTheDocument();
  });
});
