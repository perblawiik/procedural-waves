/**
 * Author: Per Blåwiik
 * Date: 2019-12-29
 */

//TODO: Implement Quaternion for handling rotations

import Matrix4 from './math/Matrix4';
import Vector3 from './math/Vector3';

class Transform {
    constructor() {
        this.position = new Vector3([0.0, 0.0, 0.0]);
        this.rotation = new Vector3([0.0, 0.0, 0.0]);
        this.scaling = new Vector3([1.0, 1.0, 1.0]);

        this.matrix = Matrix4.identity();
        this.localMatrix = Matrix4.identity();

        this.customRotation = new Vector3([1.0, 0.0, 0.0]);
        this.customRotationRad = 0.0;

        this.parent = null;
        this.children = [];
    }

    get xAxis() {
        return new Vector3([this.matrix[0], this.matrix[4], this.matrix[8]]);
    }

    setScale(scale) {
        this.scaling.set(scale);
        this.composeMatrix();

        this.updateChildrenTransforms();
    }

    setPosition(position) {
        this.position.set(position);
        this.composeMatrix();

        this.updateChildrenTransforms();
    }

    setRotation (rotation) {
        this.rotation.set(rotation);
        this.composeMatrix();

        this.updateChildrenTransforms();
    }

    translate(val) {
        let rightVec = new Vector3([this.localMatrix[0]*val[0], this.localMatrix[4]*val[0], this.localMatrix[8]*val[0]]);
        let upVec = new Vector3([this.localMatrix[1]*val[1], this.localMatrix[5]*val[1], this.localMatrix[9]*val[1]]);
        let forwardVec = new Vector3([this.localMatrix[2]*val[2], this.localMatrix[6]*val[2], this.localMatrix[10]*val[2]]);

        this.setPosition([
            this.position.x + rightVec.x/this.scaling.x - upVec.x/this.scaling.x - forwardVec.x/this.scaling.x,
            this.position.y - rightVec.y/this.scaling.y + upVec.y/this.scaling.y - forwardVec.y/this.scaling.y,
            this.position.z - rightVec.z/this.scaling.z - upVec.z/this.scaling.z + forwardVec.z/this.scaling.z,
        ]);
    }

    rotate (rot) {
        this.setRotation([
            this.rotation.x + rot[0],
            this.rotation.y + rot[1],
            this.rotation.z + rot[2]
        ]);
    }

    setAxisRotation(axis, angle) {
        this.customRotation.set([axis.x, axis.y, axis.z]);
        this.customRotationRad = (Math.PI * angle) / 180.0;

        this.composeMatrix();
        this.updateChildrenTransforms();
    }

    setParent(parentTransform) {
        this.parent = parentTransform;
        this.matrix = Matrix4.multiply(this.parent.matrix, this.localMatrix);

        this.updateChildrenTransforms();
    }

    removeParent() {
        this.parent = null;
        this.composeMatrix();
    }

    addChild(child) {
        this.children.push(child);
        child.setParent(this);
    }

    invert () {
        return Matrix4.invert(this.matrix, this.matrix);
    }

    composeMatrix () {
        let scaleMatrix = Matrix4.scaling(this.scaling.x, this.scaling.y, this.scaling.z);

        let rotationMatrix = Matrix4.rotateZ(Matrix4.identity(), (this.rotation.z*Math.PI/180));
        rotationMatrix = Matrix4.rotateX(rotationMatrix, (this.rotation.x*Math.PI/180));
        rotationMatrix = Matrix4.rotateY(rotationMatrix, (this.rotation.y*Math.PI/180));
        Matrix4.rotate(rotationMatrix, rotationMatrix, this.customRotationRad, this.customRotation);

        let translationMatrix = Matrix4.translation(this.position.x, this.position.y, this.position.z);

        this.localMatrix = Matrix4.multiply(rotationMatrix, scaleMatrix);
        this.localMatrix = Matrix4.multiply(translationMatrix, this.localMatrix);

        if (this.parent) {
            this.matrix = Matrix4.multiply(this.parent.matrix, this.localMatrix);
        }
        else {
            this.matrix = this.localMatrix;
        }

    }

    updateChildrenTransforms() {
        for (let i = 0; i < this.children.length; ++i) {
            this.children[i].setParent(this);
        }
    }
}

export default Transform;