import React from 'react';

const Vehicle = ({ type, position, direction }) => {
  return (
    <div className={`vehicle vehicle-${type} vehicle-${direction}`} style={{ left: position.x, top: position.y }}>
      {/* Vehicle SVG or image here */}
    </div>
  );
}

export default Vehicle;
