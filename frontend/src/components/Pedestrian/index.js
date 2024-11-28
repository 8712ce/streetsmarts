import React from 'react';
import './pedestrian.css';

const Pedestrian = ({ pedestrian }) => {
  if (!pedestrian || !pedestrian.currentPosition) {
    return null;
  }

  return (
    <div
      className="pedestrian"
      style={{
        left: `${pedestrian.currentPosition.x}%`,
        top: `${pedestrian.currentPosition.y}%`
        // transform: `translate(${pedestrian.currentPosition.x}px, ${pedestrian.currentPosition.y}px)`
      }}>
      {pedestrian && (
        <img src={pedestrian.image} alt={pedestrian.name} className="pedestrian-image" style={{ transform: 'translate(-50%, -95%)' }} />
      )}
    </div>
  );
};

export default Pedestrian;
