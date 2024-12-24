import React from "react";
import './controls.css';

export default function Controls({
    // showLookButtons,
    canLook,
    canMove,

    // MOVE/LOOK BUTTON EVENT HANDLERS //
    onMoveForward,
    onMoveBackward,
    onLookLeft,
    onLookRight,
    onLookCenter,

    // DISABLING LOGIC //
    disableForward,
    disableBackward,
    disableLookLeft,
    disableLookRight,
    disableLookCenter
}) {
    return (
        <div className="button-container">

            {/* LOOK BUTTONS */}
            {/* {showLookButtons && (
                <>
                    <button onClick={onLookLeft} disabled={disableLookLeft}>Look Left</button>
                    <button onClick={onLookCenter} disabled={disableLookCenter}>Center View</button>
                    <button onClick={onLookRight} disabled={disableLookRight}>Look Right</button>
                </>
            )} */}
            <button onClick={() => onLookLeft()} disabled={!canLook}>Look Left</button>
            <button onClick={() => onLookCenter()} disabled={!canLook}>Center View</button>
            <button onClick={() => onLookRight()} disabled={!canLook}>Look Right</button>

            {/* MOVE BUTTONS */}
            <button onClick={onMoveForward} disabled={disableForward}>Move Forward</button>
            <button onClick={onMoveBackward} disabled={disableBackward}>Move Backward</button>
        </div>
    )
}