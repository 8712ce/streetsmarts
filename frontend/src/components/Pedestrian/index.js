import React from 'react';
import './pedestrian.css';

const Pedestrian = ({ pedestrian }) => {
  return (
    <div className="pedestrian" style={{ transform: `translate(${pedestrian.currentPosition.x}px, ${pedestrian.currentPosition.y}px)` }}>
      {pedestrian && (
        <img src={pedestrian.image} alt={pedestrian.name} className="pedestrian-image" />
      )}
    </div>
  );
};

export default Pedestrian;
