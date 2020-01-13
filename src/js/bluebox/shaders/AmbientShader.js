/**
 * Author: Per Blåwiik
 * Date: 2019-12-29
 */

class AmbientShader {
    static get vertex () {
        return [
            "precision mediump float;",

            // Attribute locations
            "attribute vec3 vertPosition;",
            "attribute vec3 vertNormal;",
            "attribute vec2 vertTexCoord;",

            // Transformation matrices
            "uniform mat4 cameraView;",
            "uniform mat4 modelView;",
            "uniform mat4 perspective;",

            // Fragment shader input variables
            "varying vec3 Normal;",

            "void main() {",
                // Fragment shader input variables
                "Normal = normalize(mat3(modelView)*vertNormal);",
                // Final transformation ( Perspective multiplied with the model view )
                "mat4 T = perspective * cameraView * modelView;",
                // Transform (x,y,z) vertex coordinates with a 4x4 matrix T
                "gl_Position = T * vec4(vertPosition, 1.0);",
            "}"
        ].join("\n");
    }

    static get fragment () {
        return [
            // Float precision
            "precision mediump float;",

            // Fragment shader input variables
            "varying vec3 Normal;",

            // Shader inputs
            "uniform vec3 viewPosition;",
            "uniform vec3 diffuseColor;",

            "void main() {",
                "gl_FragColor = vec4 (diffuseColor, 1.0);",
            "}"
        ].join("\n");
    }
}

export default AmbientShader;