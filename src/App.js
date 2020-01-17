import React, { Component } from 'react';

// CSS
import './App.css';

// JavaScript
import EngineWindow from './js/bluebox/gui/EngineWindow';
import SidePanel from './js/bluebox/gui/SidePanel';
import TopPanel from './js/bluebox/gui/TopPanel';
import ConnectionManager from './js/bluebox/ConnectionManager';

class App extends Component {

    constructor(props) {
        super(props);

        this.state = {
            colorTag: 'waterColor',
            amplitudeTag: 'harmonicAmplitude',
            waveLengthTag: 'harmonicWaveLength',
            sharpnessTag: 'waveSharpness',
            speedTag: 'harmonicSpeed',
            angleTag: 'harmonicDirectionAngle'
        };

        // Default settings for the procedural waves
        ConnectionManager.init();
        ConnectionManager.registerItem(this.state.colorTag, { r: 0.1, g: 0.15, b: 0.4 });
        ConnectionManager.registerItem(this.state.amplitudeTag, 4.0);
        ConnectionManager.registerItem(this.state.waveLengthTag, 65.0);
        ConnectionManager.registerItem(this.state.sharpnessTag, 3.0);
        ConnectionManager.registerItem(this.state.speedTag, 5.0);
        ConnectionManager.registerItem(this.state.angleTag, 1.57079632679); // PI/2
    }

    render() {
        const midSectionContainerStyle = {
            height: '100%',
            width: '100%',
            display: 'flex',
            flexDirection: 'row'
        };

        return (
            <div className="App-container">
                <TopPanel/>
                <div style={midSectionContainerStyle}>
                    <SidePanel width={'300px'}
                               colorTag={this.state.colorTag}
                               amplitudeTag={this.state.amplitudeTag}
                               waveLengthTag={this.state.waveLengthTag}
                               sharpnessTag={this.state.sharpnessTag}
                               speedTag={this.state.speedTag}
                               angleTag={this.state.angleTag}/>

                    <div id="engine-window-container">
                        <EngineWindow />
                    </div>
                </div>
            </div>
        );
    }
}

export default App;