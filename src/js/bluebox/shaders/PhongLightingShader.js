/**
 * Author: Per Blåwiik
 * Date: 2019-12-29
 */

class PhongLightingShader {
    static get vertex () {
        return [
            "precision highp float;",

            // Attribute locations
            "attribute vec3 vertPosition;",
            "attribute vec3 vertNormal;",
            "attribute vec2 vertTexCoord;",

            // Transformation matrices
            "uniform mat4 cameraView;",
            "uniform mat4 modelView;",
            "uniform mat4 perspective;",

            // Fragment shader input variables
            "varying vec2 TexCoords;",
            "varying vec3 Normal;",
            "varying vec3 FragPosition;",

            "void main() {",
                // Final transformation ( Perspective multiplied with the model view )
                "mat4 T = perspective * cameraView * modelView;",
                // Transform (x,y,z) vertex coordinates with a 4x4 matrix T
                "gl_Position = T * vec4(vertPosition, 1.0);",

                // Fragment shader input variables
                "Normal = normalize(mat3(modelView)*vertNormal);",
                "TexCoords = vertTexCoord;",
                "FragPosition = vec3(modelView * vec4(vertPosition, 1.0));",
            "}"
        ].join("\n");
    }

    static get fragment () {
        return [
            // Float precision
            "precision highp float;",
            // Fragment shader input variables
            "varying vec2 TexCoords;",
            "varying vec3 Normal;",
            "varying vec3 FragPosition;",

            "struct PointLight {",
                "vec3 position;",
                "vec3 color;",
                "vec2 attenuationConstants;",
            "};",

            // Shader inputs
            "uniform vec3 viewPosition;", // Current camera position
            "uniform vec3 diffuseColor;", // Object surface color
            "uniform int lightCount;", // Number of light sources
            "uniform PointLight pointLights[10];", // Set maximum point light sources to 10 per scene shader

            // Computes the specular light effect based on the dot product of the reflected light vector and the camera view vector
            "vec3 computeSpecularLight(vec3 viewDirection, vec3 reflectDirection, vec3 lightColor) {",
                "float specularStrength = 0.5;",
                "float shininess = 32.0;",
                "float spec = pow(max(dot(viewDirection, reflectDirection), 0.0), shininess);",
                "return spec * specularStrength * lightColor;",
            "}",

            // Computes the intensity based on the distance from the light source
            "float computeLightAttenuation(vec3 lightPosition, vec2 attenuationConstants) {",
                // Calculate the distance from current pixel to the light source
                "float dist = distance(lightPosition, FragPosition);",
                // The constants are set to simulate the light's intensity drop off over distance
                "return min(1.0 / (1.0 + dist*attenuationConstants.x + dist*dist*attenuationConstants.y), 1.0);",
            "}",

            "vec3 computeDiffuseSpecular(PointLight pointLight, vec3 viewDirection) {",
                // Compute the vector from the pixel to the light source
                "vec3 lightDirection = normalize(pointLight.position - FragPosition);",
                // Diffuse lighting
                "float diff = max(dot(Normal, lightDirection), 0.0);",
                "vec3 diffuse = (diff * pointLight.color * diffuseColor);",

                // Compute the vector of the reflected light based on the incoming light vector
                "vec3 reflectDirection = reflect(-lightDirection, Normal);",
                // Specular lighting
                "vec3 specular = computeSpecularLight(viewDirection, reflectDirection, pointLight.color) * diff;",

                // Compute attenuation (intensity decrement over distance).
                "float attenuation = computeLightAttenuation(pointLight.position, pointLight.attenuationConstants);",

                // Phong lighting model
                "return (diffuse + specular) * attenuation;",
            "}",
            "",
            "void main() {",
                // Ambient lighting
                "float ambientStrength = 0.05;",
                "vec3 ambientColor = vec3(1.0, 1.0, 1.0);",
                "vec3 ambient = ambientStrength * ambientColor * diffuseColor;",
                "vec3 phong = ambient;",

                // Compute the vector from the pixel to the camera
                "vec3 viewDirection = normalize(viewPosition - FragPosition);",
                // Add point light sources
                "for(int i = 0; i < 10; i++) {",
                    "if (i > lightCount) break;",
                    "phong += computeDiffuseSpecular(pointLights[i], viewDirection);",
                "}",
                // Final shaded color (texture * lighting)
                "gl_FragColor = vec4 (phong, 1.0);",
            "}"
        ].join("\n");
    }
}

export default PhongLightingShader;