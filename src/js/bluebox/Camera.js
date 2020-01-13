/**
 * Author: Per Blåwiik
 * Date: 2019-12-29
 */

// JavaScript
import Transform from './Transform';
import Vector3 from './math/Vector3';

class Camera {
    constructor(shaders) {
        this.transform = new Transform();
        this.shaders = shaders;
        this.updateUniforms();
    }

    get position() {
        return this.transform.position;
    }

    get rotation() {
        return this.transform.rotation;
    }

    get scale() {
        return this.transform.scaling;
    }

    get right() {
        return new Vector3([this.transform.matrix[0], this.transform.matrix[4], this.transform.matrix[8]]);
    }

    get up () {
        return new Vector3([this.transform.matrix[1], this.transform.matrix[5], this.transform.matrix[9]]);
    }

    get forward() {
        return new Vector3([-this.transform.matrix[2], -this.transform.matrix[6], -this.transform.matrix[10]]);
    }

    translate (val) {
        let rightVec = new Vector3([this.transform.matrix[0]*val[0], this.transform.matrix[4]*val[0], this.transform.matrix[8]*val[0]]);
        let upVec = new Vector3([this.transform.matrix[1]*val[1], this.transform.matrix[5]*val[1], this.transform.matrix[9]*val[1]]);
        let forwardVec = new Vector3([this.transform.matrix[2]*val[2], this.transform.matrix[6]*val[2], this.transform.matrix[10]*val[2]]);

        this.setPosition([
            this.transform.position.x + rightVec.x + upVec.x + forwardVec.x,
            this.transform.position.y + rightVec.y + upVec.y + forwardVec.y,
            this.transform.position.z + rightVec.z + upVec.z + forwardVec.z,
        ]);
    }

    rotate (rot) {
        this.setRotation([
            this.transform.rotation.x + rot[0],
            this.transform.rotation.y + rot[1],
            this.transform.rotation.z + rot[2]
        ]);
    }

    setPosition(cameraPosition) {
        this.transform.setPosition(cameraPosition);
        this.transform.invert();
        this.updateUniforms();
    }

    setRotation(cameraRotation) {
        this.transform.setRotation(cameraRotation);
        this.transform.invert();
        this.updateUniforms();
    }

    rotateX (angle) {
        this.setRotation([angle, this.transform.rotation.y, this.transform.rotation.z]);
    }

    rotateY (angle) {
        this.setRotation([this.transform.rotation.x, angle, this.transform.rotation.z]);
    }

    updateUniforms() {
        this.shaders.forEach((shader) => {
            shader.activate();
            shader.setCameraViewUniform(this.transform.matrix);
            shader.setCameraViewPosition(this.transform.position);
        });
    }
}

export default Camera;