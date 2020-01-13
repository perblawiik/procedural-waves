/**
 * Author: Per Blåwiik
 * Date: 2019-12-29
 */

import React, { Component } from 'react';

// CSS
import '../../../css/EngineWindow.css';

// JS
import Engine from '../Engine';

class EngineWindow extends Component {
    constructor(props) {
        super(props);

        this.state = {
            canvasWidth: 100,
            canvasHeight: 100
        };

        this.animationId = null;
        this.engine = new Engine();
    }

    resizeCanvas() {
        this.setState({
            canvasWidth: this.engineWindowContainer.offsetWidth,
            canvasHeight: this.engineWindowContainer.offsetHeight
        });
    }

    componentDidMount() {
        // The engine window container component is used for setting the size of the canvas
        this.engineWindowContainer = document.getElementById("canvas-container");
        window.addEventListener("resize", this.resizeCanvas.bind(this));

        // Start the loop
        this.startMainLoop();
    }

    componentWillUnmount() {
        this.stopMainLoop();
        window.removeEventListener("resize", this.resizeCanvas.bind(this));
    }

    startMainLoop() {
        // Set up the graphics engine (webgl context, shaders and draw scene objects)
        this.engine.preload();

        // Set to correct dimensions for canvas
        this.resizeCanvas();

        // Initiate the main loop
        this.animationId = window.requestAnimationFrame( this.mainLoop.bind(this) );
    }

    stopMainLoop() {
        window.cancelAnimationFrame( this.animationId );
        this.animationId = null;
    }

    mainLoop() {
        this.animationId = window.requestAnimationFrame( this.mainLoop.bind(this) );
        this.engine.run();
    }

    render() {
        let canvasStyle = {
            width: this.state.canvasWidth,
            height: this.state.canvasHeight
        };

        return (
            <div id="canvas-container">
                <canvas style={canvasStyle} id="gl-canvas" width={this.state.canvasWidth} height={this.state.canvasHeight}>
                    Your browser does not support HTML5
                </canvas>
                <canvas style={canvasStyle} id="text-canvas" width={this.state.canvasWidth} height={this.state.canvasHeight}>
                </canvas>
            </div>
        );
    }
}

export default EngineWindow;