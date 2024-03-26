import React from "react";
import './TwoWayStop.css';



const TwoWayStop = () => {
    return (
        <div className="two-way-stop-layout">
            {/* EASTBOUND LANE */}
            <div className="lane eastbound">
                {/* VEHICLES TRAVELING EAST */}
                <div className="vehicle east" style={{ left: "0%" }}></div>
            </div>

            {/* WESTBOUND LANE */}
            <div className="lane westbound">
                {/* VEHICLES TRAVELING WEST */}
                <div className="vehicle west" style={{ right: "0%" }}></div>
            </div>

            {/* CROSSWALK */}
            <div className="crosswalk"></div>
        </div>
    );
}

export default TwoWayStop;