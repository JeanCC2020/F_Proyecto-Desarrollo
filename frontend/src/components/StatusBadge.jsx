import React from 'react';

const StatusBadge = ({ estado }) => {
  const getBadgeClass = (status) => {
    switch (status) {
      case 'Pendiente': return 'badge-pending';
      case 'Asignada': return 'badge-assigned';
      case 'En espera de repuesto': return 'badge-waiting';
      case 'Resuelta': return 'badge-resolved';
      case 'Cerrada': return 'badge-closed';
      default: return 'badge-closed';
    }
  };

  return (
    <span className={`badge ${getBadgeClass(estado)}`}>
      {estado}
    </span>
  );
};

export default StatusBadge;
