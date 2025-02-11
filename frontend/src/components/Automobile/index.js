import React from 'react';
import './automobile.css';
import { calculateZIndex } from '../../utils/zIndexUtils';
import SpriteCanvas from '../SpriteCanvas/spriteCanvas';
import { getVehicleSprite } from '../../utils/spriteUtils';

const Automobile = ({ vehicle }) => {
    const zIndex = calculateZIndex(vehicle.currentPosition.y, vehicle._id);
    
    // IF DISPLAY IMAGE IS MISSING, COMPUTE IT //
    const spriteData = vehicle.displayImage || getVehicleSprite(vehicle);
    const { frameIndex } = spriteData;


    return (
        <div
            className='automobile'
            style={{
                left: `${vehicle.currentPosition.x}%`,
                top: `${vehicle.currentPosition.y}%`,
                zIndex,
                position: 'absolute',
                transform: 'translate(-50%, -50%)'
            }}
        >
            <SpriteCanvas
                spriteSheetUrl={vehicle.image}
                frameIndex={frameIndex}
                columns={4}
                rows={4}
                canvasWidth={1600}
                canvasHeight={1600}
            />
        </div>
    );
};

export default Automobile;
