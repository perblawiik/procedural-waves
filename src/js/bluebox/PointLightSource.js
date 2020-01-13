/**
 * Author: Per Blåwiik
 * Date: 2019-12-29
 */

import GameObject from "./GameObject";
import Vector3 from "./math/Vector3";

class PointLightSource extends GameObject{
    constructor(name) {
        super(name);
        // Initialize light color as white
        this.lightColor = new Vector3([1.0, 1.0, 1.0]);
        // The proportional constants for the light's attenuation
        this.attenuationConstants = {
            kLinear: 0.014,
            kQuadratic: 0.0007
        };
    }

    setLightColor(color) {
        this.lightColor.set(color);
    }

    setAttenuation(kLinear, kQuadratics) {
        this.attenuationConstants = {
            kLinear: kLinear,
            kQuadratic: kQuadratics
        };
    }
}

export default PointLightSource;