class MouseEvent {
    static init() {
        this.xPos = 0;
        this.yPos = 0;
        this.moveX = 0;
        this.moveY = 0;
        this.wheel = 0;
        this.down = false;
        this.up = false;
        this.buttonPressed = {
            leftButton: false,
            rightButton: false,
            middleButton: false
        };
    }

    // Setters
    static setOffsetX(offset) {
        this.xPos = offset;
    }

    static setOffsetY(offset) {
        this.yPos = offset;
    }

    static setMovementX(move) {
        this.moveX = move;
    }

    static setMovementY(move) {
        this.moveY = move;
    }

    static setMouseDownEvent(state) {
        this.down = state;
    }

    static setMouseUpEvent(state) {
        this.up = state;
    }

    static setWheelDelta(delta) {
        this.wheel = delta;
    }

    static setButtonPressedLeft(state) {
        this.buttonPressed.leftButton = state;
    }

    static setButtonPressedMiddle(state) {
        this.buttonPressed.middleButton = state;
    }

    static setButtonPressedRight(state) {
        this.buttonPressed.rightButton = state;
    }

    // Getters
    static get offsetX() {
        return this.xPos;
    }

    static get offsetY() {
        return this.yPos;
    }

    static get movementX() {
        return this.moveX;
    }

    static get movementY() {
        return this.moveY;
    }

    static get wheelDelta() {
        return this.wheel;
    }

    static get mouseDown() {
        return this.down;
    }

    static get mouseUp() {
        return this.up;
    }

    static get isPressed() {
        return this.buttonPressed;
    }
}

export default MouseEvent;