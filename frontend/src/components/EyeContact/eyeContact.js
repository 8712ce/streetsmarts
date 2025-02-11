import React, { useEffect, useState } from "react";
import { getVehicleSprite, getBackgroundPosition } from "../../utils/spriteUtils";
import './eyeContact.css';

const EyeContact = ({ vehicle }) => {
    const [spriteStyle, setSpriteStyle] = useState({});

    useEffect(() => {
        // COMPUTE SPRITE DATA IF NOT ALREADY PROVIDED //
        const spriteData = vehicle.displayImage || getVehicleSprite(vehicle);
        const { frameIndex } = spriteData;

        // USE YOUR SPRITE UTILITY TO GET THE BACKGROUND POSITION //
        const { backgroundPositionX, backgroundPositionY } = getBackgroundPosition(frameIndex);

        setSpriteStyle({
            backgroundImage: `url(${vehicle.image})`,
            backgroundPosition: `${backgroundPositionX} ${backgroundPositionY}`,
            backgroundSize: `400% 400%`,
            backgrouundRepeat: 'no-repeat'
        });
    }, [vehicle]);

    return (
        <div className="eye-contact-popup">
            <div className="eye-contact-content" style={spriteStyle}></div>
        </div>
    );
};

export default EyeContact;