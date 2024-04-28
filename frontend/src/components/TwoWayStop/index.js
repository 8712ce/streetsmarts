import React from "react";
import './TwoWayStop.css';



const TwoWayStop = () => {

    // Define lane widths and heights
//   const laneWidth = "100px";
//   const laneHeight = "50px";

    return (
        <div className="two-way-stop-layout">
            {/* EASTBOUND LANE */}
            <div className="lane eastbound">
            {/* <div className="lane eastbound" style={{ width: laneWidth, height: laneHeight }}> */}
                {/* VEHICLES TRAVELING EAST */}
                <div className="vehicle east" style={{ left: "0%" }}></div>
            </div>

            {/* WESTBOUND LANE */}
            <div className="lane westbound">
            {/* <div className="lane westbound" style={{ width: laneWidth, height: laneHeight }}> */}
                {/* VEHICLES TRAVELING WEST */}
                <div className="vehicle west" style={{ right: "0%" }}></div>
            </div>

            {/* CROSSWALK */}
            <div className="crosswalk"></div>
        </div>
    );
}

export default TwoWayStop;