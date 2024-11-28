import React from 'react';
import './pedestrian.css';

const Pedestrian = ({ pedestrian }) => {
  if (!pedestrian || !pedestrian.currentPosition) {
    return null;
  }

  const maxZIndex = 1000;
  const maxY = 100;

  // CALCULATE Z-INDEX BASED ON Y POSITION //
  let zIndex = Math.floor((pedestrian.currentPosition.y / maxY) * maxZIndex);

  // HANDLE EDGE CASES: ADD A SMALL OFFSET BASED ON PEDESTRIAN ID //
  const idOffset = parseInt(pedestrian._id, 36) % maxZIndex;
  zIndex = zIndex * maxZIndex + idOffset;

  return (
    <div
      className="pedestrian"
      style={{
        left: `${pedestrian.currentPosition.x}%`,
        top: `${pedestrian.currentPosition.y}%`,
        zIndex: zIndex,
        // position: 'absolute'
      }}>
        <img
          src={pedestrian.image}
          alt={pedestrian.name}
          className="pedestrian-image"
          style={{ transform: 'translate(-50%, -95%)' }}
        />
    </div>
  );
};

export default Pedestrian;
