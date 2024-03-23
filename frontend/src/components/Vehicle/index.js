import React from 'react';

const Car = ({ position, direction }) => {
  return (
    <div className={`car car-${direction}`} style={{ left: position.x, top: position.y }}>
      {/* Car SVG or image here */}
    </div>
  );
}

export default Car;
