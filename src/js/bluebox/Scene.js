/**
 * Author: Per Blåwiik
 * Date: 2019-12-29
 */

import Transform from "./Transform";

class Scene {
    constructor(shaders) {
        this.sceneObjects = [];
        this.lightSources = [];
        this.shaders = shaders;

        this.currentTime = 0.0;
        this.transform = new Transform();
    }

    setPosition(position) {
        this.transform.setPosition(position);
    }

    setRotation(rotation) {
        this.transform.setRotation(rotation);
    };

    setScale(scale) {
        this.transform.setScale(scale);
    }

    addGameObject(gameObject) {
        this.transform.addChild(gameObject.transform);
        this.sceneObjects.push(gameObject);
    }

    addLightSource(lightSource) {
        this.transform.addChild(lightSource.transform);
        // Update the shaders
        this.shaders.forEach((shader)=> {
            shader.activate();
            let lightCount = this.lightSources.length;
            let arrayName = "pointLights[" + lightCount + "].";

            // Get uniform locations
            let positionUniformLoc = shader.getUniformLoc(arrayName + "position");
            let colorUniformLoc = shader.getUniformLoc(arrayName + "color");
            let attenuationUniformLoc = shader.getUniformLoc(arrayName + "attenuationConstants");
            let lightCountUniformLoc = shader.getUniformLoc("lightCount");

            // Set the uniforms in the fragment shader
            shader.setUniformVec3f(positionUniformLoc, lightSource.worldPosition);
            shader.setUniformVec3f(colorUniformLoc, lightSource.lightColor);
            shader.setUniformVec2f(attenuationUniformLoc, [lightSource.attenuationConstants.kLinear, lightSource.attenuationConstants.kQuadratic]);
            shader.setUniformInt(lightCountUniformLoc, lightCount);
        });

        // Add light source to the list
        this.lightSources.push(lightSource);
    }

    // Used for dynamic light sources
    updateLightPositions() {
        // Activate the main shader
        let shader = this.shaders.get("phong");
        shader.activate();

        for (let i = 0; i < this.lightSources.length; ++i) {
            let lightSource = this.lightSources[i];
            let lightCount = this.lightSources.length;
            let arrayName = "pointLights[" + i + "].";

            // Get uniform locations
            let positionUniformLoc = shader.getUniformLoc(arrayName + "position");
            let colorUniformLoc = shader.getUniformLoc(arrayName + "color");
            let attenuationUniformLoc = shader.getUniformLoc(arrayName + "attenuationConstants");
            let lightCountUniformLoc = shader.getUniformLoc("lightCount");

            // Set the uniforms in the fragment shader
            shader.setUniformVec3f(positionUniformLoc, lightSource.worldPosition);
            shader.setUniformVec3f(colorUniformLoc, lightSource.lightColor);
            shader.setUniformVec2f(attenuationUniformLoc, [lightSource.attenuationConstants.kLinear, lightSource.attenuationConstants.kQuadratic]);
            shader.setUniformInt(lightCountUniformLoc, lightCount);
        }
    }

    draw() {
        this.sceneObjects.forEach((object)=> {
            object.render(this.shaders.get(object.shaderName));
        });

        this.lightSources.forEach((lightSource) => {
            lightSource.render(this.shaders.get("ambient"));
        });
    }

    update(timeStep) {
        this.currentTime += timeStep;
        let shader = this.shaders.get("procedural");
        shader.activate();
        let timeUniformLocation = shader.getUniformLoc("time");
        shader.setUniformFloat(timeUniformLocation, this.currentTime);

        this.sceneObjects.forEach((object) => {
            object.update(timeStep);
        });
    }
}

export default Scene;