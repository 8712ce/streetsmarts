import React from 'react';
import './automobile.css';
import { calculateZIndex } from '../../utils/zIndexUtils';
import { getBackgroundPosition } from '../../utils/spriteUtils';

const Automobile = ({ vehicle }) => {
    const zIndex = calculateZIndex(vehicle.currentPosition.y, vehicle._id);

    const { currentPosition, displayImage, image } = vehicle;
    const { frameIndex } = displayImage || {};

    console.log(`Rendering vehicle ${vehicle._id}: frameIndex=${frameIndex}, image=${image}`);

    // COMPUTE THE OFFSET WITHIN THE SPRITE SHEET //
    const { backgroundPositionX, backgroundPositionY } = getBackgroundPosition(frameIndex);


    return (
       

        <div
            className='automobile'
            style={{
                left: `${currentPosition.x}%`,
                top: `${currentPosition.y}%`,
                zIndex,

                backgroundImage: `url(${image})`,
                backgroundPositionX,
                backgroundPositionY,
            }}
        />
    );
};

export default Automobile;
