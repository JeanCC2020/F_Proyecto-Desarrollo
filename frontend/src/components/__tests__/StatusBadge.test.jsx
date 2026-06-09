import React from 'react';
import { render, screen } from '@testing-library/react';
import StatusBadge from '../StatusBadge';

describe('S036: StatusBadge Visual State Tests', () => {
  test('Debe renderizar con el estilo correcto para "Pendiente"', () => {
    render(<StatusBadge estado="Pendiente" />);
    const badge = screen.getByText('Pendiente');
    expect(badge).toBeInTheDocument();
    expect(badge).toHaveClass('badge');
    expect(badge).toHaveClass('badge-pending');
  });

  test('Debe renderizar con el estilo correcto para "Asignada"', () => {
    render(<StatusBadge estado="Asignada" />);
    const badge = screen.getByText('Asignada');
    expect(badge).toBeInTheDocument();
    expect(badge).toHaveClass('badge-assigned');
  });

  test('Debe renderizar con el estilo correcto para "En espera de repuesto"', () => {
    render(<StatusBadge estado="En espera de repuesto" />);
    const badge = screen.getByText('En espera de repuesto');
    expect(badge).toBeInTheDocument();
    expect(badge).toHaveClass('badge-waiting');
  });

  test('Debe renderizar con el estilo correcto para "Resuelta"', () => {
    render(<StatusBadge estado="Resuelta" />);
    const badge = screen.getByText('Resuelta');
    expect(badge).toBeInTheDocument();
    expect(badge).toHaveClass('badge-resolved');
  });

  test('Debe renderizar con el estilo correcto para "Cerrada"', () => {
    render(<StatusBadge estado="Cerrada" />);
    const badge = screen.getByText('Cerrada');
    expect(badge).toBeInTheDocument();
    expect(badge).toHaveClass('badge-closed');
  });

  test('Debe usar el estilo "badge-closed" por defecto para estados desconocidos', () => {
    render(<StatusBadge estado="Desconocido" />);
    const badge = screen.getByText('Desconocido');
    expect(badge).toBeInTheDocument();
    expect(badge).toHaveClass('badge-closed');
  });
});
