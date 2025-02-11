import React, { useEffect, useState } from "react";
import { getBackgroundPosition } from "../../utils/spriteUtils";
import './eyeContact.css';

const EyeContact = ({ vehicle, onClose }) => {
    const [spriteStyle, setSpriteStyle] = useState({});

    useEffect(() => {
        // DETERMINE THE CURRENT FRAME INDEX //
        const frameIndex = vehicle.displayImage ? vehicle.displayImage.frameIndex : 0;
        // USE YOUR SPRITE UTILITY TO GET THE BACKGROUND POSITION //
        const { backgroundPositionX, backgroundPositionY } = getBackgroundPosition(frameIndex);

        // DEFINE A ZOOM FACTOR TO "CLOSE UP" THE SPRITE //
        const zoomFactor = 3;

        setSpriteStyle({
            backgroundImage: `url(${vehicle.image})`,
            backgroundPosition: `${backgroundPositionX} ${backgroundPositionY}`,
            backgroundSize: `${zoomFactor * 100}% ${zoomFactor * 100}%`,
            backgrouundRepeat: 'no-repeat'
        });

        // SET A TIMER TO AUTOMATICALLY CLOSE THIS POPUP AFTER 2 SECONDS //
        const timer = setTimeout(() => {
            onClose();
        }, 2000);

        return () => clearTimeout(timer);
    }, [vehicle, onClose]);

    return (
        <div className="eye-contact-popup">
            <div className="eye-contact-content" style={spriteStyle}></div>
        </div>
    );
};

export default EyeContact;