import React, { Component } from 'react';

import ConnectionManager from "../ConnectionManager";

class SidePanel extends Component {

    setNewValue(id) {
        let newValue;

        if (id === this.props.colorTag) {
            // Color values must be between 0.0 and 1.0
            let r = this.clamp(parseFloat(document.getElementById('r-color').value)/255.0, 0.0, 1.0);
            let g = this.clamp(parseFloat(document.getElementById('g-color').value)/255.0, 0.0, 1.0);
            let b = this.clamp(parseFloat(document.getElementById('b-color').value)/255.0, 0.0, 1.0);

            newValue = {r, g, b};
        }
        else {
            newValue = parseFloat(document.getElementById(id).value);
        }

        ConnectionManager.setItemValue(id, newValue);
        ConnectionManager.sendSignal(id);
    }

    handleKeyPress(id, target) {
        const ENTER = 13;
        //If enter is pressed click submit button with given id.
        if (target.charCode === ENTER) {
            document.getElementById(id).click();
        }
    }

    clamp(val, min, max) {
        if (val > max)
            return max;
        else if (val < min)
            return min;

        return val;
    }

    render() {

        const containerStyle = {
            backgroundColor: '#2a2d38',
            width: this.props.width,
            textAlign: 'center',
            overflow: 'auto'
        };

        const titleStyle = {
            color: 'white',
            fontSize: '2em'
        };

        const textStyle = {
            color: 'white',
            fontSize: '1.0em'
        };

        const inputStyle = {
            marginLeft: 10,
            width: 40
        };

        const settingContainerStyle = {
            paddingBottom: 5
        };

        const rangeWidth = 175;

        // Displays the value as integer
        let formatInputValue = function (val, radix) {
            return parseInt(val, radix);
        };

        let waterColor = ConnectionManager.getItemValue(this.props.colorTag);

        return (
            <div id="side-panel" style={containerStyle}>
                <p style={titleStyle}>
                   PARAMETERS
               </p>

                <div style={settingContainerStyle}>
                    <p style={textStyle}>
                        Amplitude
                    </p>
                    <input style={{width:rangeWidth}}
                           id={this.props.amplitudeTag}
                           type="range"
                           min="0.0"
                           max="10.0"
                           step="0.1"
                           defaultValue={ConnectionManager.getItemValue(this.props.amplitudeTag)}
                           onChange={this.setNewValue.bind(this, this.props.amplitudeTag)}/>
                </div>

                <div style={settingContainerStyle}>
                    <p style={textStyle}>
                        Wave Length
                    </p>
                    <input style={{width:rangeWidth}}
                           id={this.props.waveLengthTag}
                           type="range"
                           min="15.0"
                           max="300.0"
                           step="1.0"
                           defaultValue={ConnectionManager.getItemValue(this.props.waveLengthTag)}
                           onChange={this.setNewValue.bind(this, this.props.waveLengthTag)}/>
                </div>

                <div style={settingContainerStyle}>
                    <p style={textStyle}>
                        Speed
                    </p>
                    <input style={{width:rangeWidth}}
                           id={this.props.speedTag}
                           type="range"
                           min="0.0"
                           max="20.0"
                           step="0.1"
                           defaultValue={ConnectionManager.getItemValue(this.props.speedTag)}
                           onChange={this.setNewValue.bind(this, this.props.speedTag)}/>
                </div>

                <div style={settingContainerStyle}>
                    <p style={textStyle}>
                        Sharpness
                    </p>
                    <input style={{width:rangeWidth}}
                           id={this.props.sharpnessTag}
                           type="range"
                           min="1.0"
                           max="20.0"
                           step="0.1"
                           defaultValue={ConnectionManager.getItemValue(this.props.sharpnessTag)}
                           onChange={this.setNewValue.bind(this, this.props.sharpnessTag)}/>
                </div>

                <div style={settingContainerStyle}>
                    <p style={textStyle}>
                        Direction
                    </p>
                    <input style={{width:rangeWidth}}
                           id={this.props.angleTag}
                           type="range"
                           min="0.0"
                           max="6.28318530718"
                           step="0.06283185307"
                           defaultValue={ConnectionManager.getItemValue(this.props.angleTag)}
                           onChange={this.setNewValue.bind(this, this.props.angleTag)}/>
                </div>

                <div style={settingContainerStyle}>
                    <p style={textStyle}>
                        Color
                    </p>
                    <div style={{display: 'flex', flexDirection: 'row'}}>

                        <input style={inputStyle}
                               id='r-color'
                               type="number"
                               step='1'
                               min='0'
                               max='255'
                               onKeyPress={this.handleKeyPress.bind(this, 'submit-color')}
                               defaultValue={formatInputValue(waterColor.r*255)}/>

                        <input style={inputStyle}
                               id='g-color'
                               type="number"
                               step='1.0'
                               min='0.0'
                               max='255.0'
                               onKeyPress={this.handleKeyPress.bind(this, 'submit-color')}
                               defaultValue={formatInputValue(waterColor.g*255)}/>

                        <input style={inputStyle}
                               id='b-color'
                               type="number"
                               step='1.0'
                               min='0.0'
                               max='255.0'
                               onKeyPress={this.handleKeyPress.bind(this, 'submit-color')}
                               defaultValue={formatInputValue(waterColor.b*255)}/>
                        <button id='submit-color' style={{marginLeft: 10, marginRight: 10, cursor: 'pointer'}} onClick={this.setNewValue.bind(this,this.props.colorTag)}>
                            Submit
                        </button>
                    </div>
                </div>
            </div>
        );
    }
}

export default SidePanel;