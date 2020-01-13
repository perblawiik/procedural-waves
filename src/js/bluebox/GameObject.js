/**
 * Author: Per Blåwiik
 * Date: 2019-12-29
 */

import Transform from './Transform';
import Vector3 from "./math/Vector3";

class GameObject {
    constructor (name) {
        this.nameTag = name;
        this.meshes = [];
        this.transform = new Transform();
        this.shaderName = "phong";
    }

    get worldPosition() {
        return new Vector3([this.transform.matrix[12], this.transform.matrix[13], this.transform.matrix[14]]);
    }

    setNameTag(name) {
        this.nameTag = name;
    }

    translate (val) {
        this.transform.translate(val);
    }

    rotate(rot) {
        this.transform.rotate(rot);
    }

    setPosition(pos) {
        this.transform.setPosition(pos);
    }

    setRotation(rot) {
        this.transform.setRotation(rot);
    }

    setScale(scale) {
        this.transform.setScale(scale);
    }

    addMesh (mesh) {
        this.transform.addChild(mesh.transform);
        this.meshes.push(mesh);
    }

    setShader(name) {
        this.shaderName = name;
    }

    render(shader) {
        for (let i = 0; i < this.meshes.length; ++i) {
            this.meshes[i].render(shader);
        }
    }

    update(timeStep) {
        this.customUpdate(timeStep);
    }

    customUpdate(timeStep) {

    }
}

export default GameObject;