import React, { Component } from 'react';

// CSS
import '../../../css/TopPanel.css';

class TopPanel extends Component {

    render() {
        const containerStyle = {
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#0074ff',
            color: 'white',
            width: '100%',
            fontSize: '1.0em'
        };

        const dropdownButtonStyle = {
            backgroundColor: 'Transparent',
            color: 'white',
            padding: '1.0em 2.0em 1.0em 2.0em',
            fontSize: '2.0em',
            border: 'none'
        };

        return (
            <div id="top-panel" style={containerStyle}>
               <h1>
                   Procedural Waves Demo
               </h1>
                <div className="dropdown-container">
                    <button className="dropbtn" style={dropdownButtonStyle}>Controls</button>

                    <div className="dropdown-content">
                        <div>
                            <p style={{fontWeight:'bold', margin:0}}>Rotate</p>
                            <p style={{marginTop: 0}}>Press and hold right mouse button</p>
                        </div>

                        <div>
                            <p style={{fontWeight:'bold', margin:0}}>Move Left/Right/Up/Down</p>
                            <p style={{marginTop: 0}}>Press and hold left mouse button</p>
                        </div>

                        <div>
                            <p style={{fontWeight:'bold', margin:0}}>Move Forward/Backwards</p>
                            <p style={{marginTop: 0}}>Turn <b>or</b> Press and hold scroll wheel</p>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default TopPanel;