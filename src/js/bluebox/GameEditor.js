/**
 * Author: Per Blåwiik
 * Date: 2019-12-29
 */

import Time from "./Time";
import MouseEvent from "./events/MouseEvent";

class GameEditor {
    constructor(gl, context2D, shaders, camera, canvas) {
        this.gl = gl;
        this.context2D = context2D;
        this.canvas = canvas;
        this.camera = camera;

        // Initialize timing variables
        this.lastTime = 0.0;
        this.frameCount = 0;
        this.fps = 0;
        this.currentTextOffset = 0;
    }

    render(scenes) {
        this.drawTextElements();
    }

    processUserInput() {
        // Handle camera navigation
        this.processCameraNavigation();
    }

    processCameraNavigation () {
        // Zoom camera view in and out
        if (MouseEvent.isPressed.middleButton) {
            this.camera.translate([0.0, 0.0, -(MouseEvent.movementY + MouseEvent.movementX)/20.0]);
        } // Pan the camera view
        else if(MouseEvent.isPressed.leftButton) {
            this.camera.translate([-MouseEvent.movementX/40.0, MouseEvent.movementY/40.0, 0.0]);
        } // Rotate the camera view
        else if (MouseEvent.isPressed.rightButton) {
            this.camera.rotate([-MouseEvent.movementY/10.0, -MouseEvent.movementX/10.0, 0.0]);
        }

        if (Math.abs(MouseEvent.wheelDelta) > 0.01) {
            if (MouseEvent.wheelDelta > 0.0) {
                this.camera.translate([0.0, 0.0, 2.0]);
            }
            else {
                this.camera.translate([0.0, 0.0, -2.0]);
            }
        }
    }

    drawTextElements() {
        // Set text font style
        this.context2D.font = "20px Consolas";
        this.context2D.fillStyle = 'white';
        this.currentTextOffset = 0;

        // Clear previous
        this.context2D.clearRect(this.currentTextOffset, 0, this.canvas.offsetWidth, 30);

        // Draw the text
        this.displayFrameRate();
        this.displayCameraPosition();
    }

    displayFrameRate() {
        let currentTime = Time.time;
        // If tNow - tLast >= 1000, one second has passed
        if ((currentTime - this.lastTime) >= 1000.0) {
            // Fps = the number of frames
            this.fps = this.frameCount;
            // Update timer
            this.lastTime = currentTime;
            // Reset frame count
            this.frameCount = 0;
        }
        else {
            ++this.frameCount;
        }

        // Compose text string
        let fpsText = "Frame rate: " + this.fps + " fps, Time per frame: " + Time.deltaTime.toFixed(0) + " ms,";
        // Draw fps and frame time in milliseconds
        this.context2D.fillText(fpsText, 10, 25);
        // Update text offset for next text
        this.currentTextOffset = fpsText.length * 12 + 10;
    }

    displayCameraPosition() {
        let pos = this.camera.transform.position;
        // Compose text string
        let cameraPositionText = "Camera position: (" + pos.x.toFixed(2) + ", " + pos.y.toFixed(2) + ", " + pos.z.toFixed(2) + ")";

        // Draw fps and frame time in milliseconds
        this.context2D.fillText(cameraPositionText, this.currentTextOffset, 25);
        // Update text offset for next text
        this.currentTextOffset = cameraPositionText.length * 12;
    }
}

export default GameEditor;