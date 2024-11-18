import React from 'react';
import { Link } from 'react-router-dom';

function Home() {
    return (
        <div className='home_container'>
            <h1>Welcome to Street Smarts</h1>
            <ul>
                <li>
                    <Link to='four_way_stop_signs'>Four Way Intersection with Stop Signs</Link>
                    <Link to='four_way_traffic_signals'>Four Way Intersection with Traffic Signals</Link>
                </li>
            </ul>
        </div>
    )
}

export default Home;