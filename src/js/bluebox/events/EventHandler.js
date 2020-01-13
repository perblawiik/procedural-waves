import MouseEvent from "./MouseEvent";

// Enum struct for handling mouse events
const MouseKey = {
    LEFT: 1,
    MIDDLE: 2,
    RIGHT: 3
};

class EventHandler {
    static init() {
        MouseEvent.init();

        let canvas2D = document.getElementById('text-canvas');
        // Mouse down event function definition
        canvas2D.onmousedown = function(event) {
            // Register the event
            MouseEvent.setMouseDownEvent(true);

            if(event.which === MouseKey.LEFT) {
                MouseEvent.setButtonPressedLeft(true);
            }
            if (event.which === MouseKey.RIGHT) {
                MouseEvent.setButtonPressedRight(true);
            }
            if (event.which === MouseKey.MIDDLE) {
                MouseEvent.setButtonPressedMiddle(true);
            }
        };

        // Mouse up event function definition
        canvas2D.onmouseup = function(event) {
            // Register the event
            MouseEvent.setMouseUpEvent(true);

            if(event.which === MouseKey.LEFT) {
                MouseEvent.setButtonPressedLeft(false);
            }
            if (event.which === MouseKey.RIGHT) {
                MouseEvent.setButtonPressedRight(false);
            }
            if (event.which === MouseKey.MIDDLE) {
                MouseEvent.setButtonPressedMiddle(false);
            }
        };

        // Mouse leave event function definition
        canvas2D.onmouseleave = function(event) {
            MouseEvent.setButtonPressedLeft(false);
            MouseEvent.setButtonPressedRight(false);
            MouseEvent.setButtonPressedMiddle(false);
        };

        // Mouse move event function definition
        canvas2D.onmousemove  = function(event) {
            // Set mouse position in the viewport
            MouseEvent.setOffsetX(event.offsetX);
            MouseEvent.setOffsetY(event.offsetY);

            // Set mouse movement in the viewport
            MouseEvent.setMovementX(event.movementX);
            MouseEvent.setMovementY(event.movementY);
        };

        // Mouse wheel event function definition
        canvas2D.onwheel = function(event) {
            MouseEvent.setWheelDelta(event.deltaY);
        };
    }
    static resetMouseEvents() {
        MouseEvent.setMouseDownEvent(false);
        MouseEvent.setMouseUpEvent(false);
        MouseEvent.setWheelDelta(0);
        MouseEvent.setMovementX(0);
        MouseEvent.setMovementY(0);
    }
}

export default EventHandler;