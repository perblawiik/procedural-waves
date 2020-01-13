/**
 * Author: Per Blåwiik
 * Date: 2019-12-29
 */

/* POSSIBLE IMPROVEMENTS:
*  - Surface breaking foam
*  - Wave sharpness based on the water depth
*  - Tessellation
* */

class ProceduralShader {
        static get perlinNoise() {
        //
        // Description : Array and textureless GLSL 3D simplex noise function.
        //      Author : Ian McEwan, Ashima Arts.
        //  Maintainer : ijm
        //     Lastmod : 20110822 (ijm)
        //     License : Copyright (C) 2011 Ashima Arts. All rights reserved.
        //               Distributed under the MIT License. See LICENSE file.
        //               https://github.com/ashima/webgl-noise
        //
        return [
            "vec3 mod289(vec3 x) {",
                "return x - floor(x * (1.0 / 289.0)) * 289.0;",
            "}",

            "vec4 mod289(vec4 x) {",
                "return x - floor(x * (1.0 / 289.0)) * 289.0;",
            "}",

            "vec4 permute(vec4 x) {",
                "return mod289(((x*34.0)+1.0)*x);",
            "}",

            "vec4 taylorInvSqrt(vec4 r) {",
                "return 1.79284291400159 - 0.85373472095314 * r;",
            "}",

            "float snoise(vec3 v) {",
                "const vec2  C = vec2(1.0/6.0, 1.0/3.0);",
                "const vec4  D = vec4(0.0, 0.5, 1.0, 2.0);",

                // First corner
                "vec3 i  = floor(v + dot(v, C.yyy) );",
                "vec3 x0 =   v - i + dot(i, C.xxx) ;",

                // Other corners
                "vec3 g = step(x0.yzx, x0.xyz);",
                "vec3 l = 1.0 - g;",
                "vec3 i1 = min( g.xyz, l.zxy );",
                "vec3 i2 = max( g.xyz, l.zxy );",

                "vec3 x1 = x0 - i1 + C.xxx;",
                "vec3 x2 = x0 - i2 + C.yyy;", // 2.0*C.x = 1/3 = C.y
                "vec3 x3 = x0 - D.yyy;",      // -1.0+3.0*C.x = -0.5 = -D.y

                // Permutations
                "i = mod289(i);",
                "vec4 p = permute( permute( permute(",
                "i.z + vec4(0.0, i1.z, i2.z, 1.0 ))",
                "+ i.y + vec4(0.0, i1.y, i2.y, 1.0 ))",
                "+ i.x + vec4(0.0, i1.x, i2.x, 1.0 ));",

                // Gradients: 7x7 points over a square, mapped onto an octahedron.
                // The ring size 17*17 = 289 is close to a multiple of 49 (49*6 = 294)
                "float n_ = 0.142857142857; // 1.0/7.0",
                "vec3  ns = n_ * D.wyz - D.xzx;",

                "vec4 j = p - 49.0 * floor(p * ns.z * ns.z);",  //  mod(p,7*7)

                "vec4 x_ = floor(j * ns.z);",
                "vec4 y_ = floor(j - 7.0 * x_ );",   // mod(j,N)

                "vec4 x = x_ *ns.x + ns.yyyy;",
                "vec4 y = y_ *ns.x + ns.yyyy;",
                "vec4 h = 1.0 - abs(x) - abs(y);",

                "vec4 b0 = vec4( x.xy, y.xy );",
                "vec4 b1 = vec4( x.zw, y.zw );",

                "vec4 s0 = floor(b0)*2.0 + 1.0;",
                "vec4 s1 = floor(b1)*2.0 + 1.0;",
                "vec4 sh = -step(h, vec4(0.0));",

                "vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy;",
                "vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww;",

                "vec3 p0 = vec3(a0.xy,h.x);",
                "vec3 p1 = vec3(a0.zw,h.y);",
                "vec3 p2 = vec3(a1.xy,h.z);",
                "vec3 p3 = vec3(a1.zw,h.w);",

                //Normalise gradients
                "vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2, p2), dot(p3,p3)));",
                "p0 *= norm.x;",
                "p1 *= norm.y;",
                "p2 *= norm.z;",
                "p3 *= norm.w;",

                // Mix final noise value
                "vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);",
                "m = m * m;",
                "return 42.0 * dot( m*m, vec4( dot(p0,x0), dot(p1,x1),",
                "dot(p2,x2), dot(p3,x3) ) );",
            "}",

            "float sdnoise(vec3 v, out vec3 gradient) {",
                "const vec2  C = vec2(1.0/6.0, 1.0/3.0);",
                "const vec4  D = vec4(0.0, 0.5, 1.0, 2.0);",

                // First corner
                "vec3 i  = floor(v + dot(v, C.yyy) );",
                "vec3 x0 =   v - i + dot(i, C.xxx) ;",

                // Other corners
                "vec3 g = step(x0.yzx, x0.xyz);",
                "vec3 l = 1.0 - g;",
                "vec3 i1 = min( g.xyz, l.zxy );",
                "vec3 i2 = max( g.xyz, l.zxy );",

                "vec3 x1 = x0 - i1 + C.xxx;",
                "vec3 x2 = x0 - i2 + C.yyy;", // 2.0*C.x = 1/3 = C.y
                "vec3 x3 = x0 - D.yyy;",      // -1.0+3.0*C.x = -0.5 = -D.y

                // Permutations
                "i = mod289(i);",
                "vec4 p = permute( permute( permute(",
                "i.z + vec4(0.0, i1.z, i2.z, 1.0 ))",
                "+ i.y + vec4(0.0, i1.y, i2.y, 1.0 ))",
                "+ i.x + vec4(0.0, i1.x, i2.x, 1.0 ));",

                // Gradients: 7x7 points over a square, mapped onto an octahedron.
                // The ring size 17*17 = 289 is close to a multiple of 49 (49*6 = 294)
                "float n_ = 0.142857142857;", // 1.0/7.0
                "vec3  ns = n_ * D.wyz - D.xzx;",

                "vec4 j = p - 49.0 * floor(p * ns.z * ns.z);",  //  mod(p,7*7)

                "vec4 x_ = floor(j * ns.z);",
                "vec4 y_ = floor(j - 7.0 * x_ );",    // mod(j,N)

                "vec4 x = x_ *ns.x + ns.yyyy;",
                "vec4 y = y_ *ns.x + ns.yyyy;",
                "vec4 h = 1.0 - abs(x) - abs(y);",

                "vec4 b0 = vec4( x.xy, y.xy );",
                "vec4 b1 = vec4( x.zw, y.zw );",

                "vec4 s0 = floor(b0)*2.0 + 1.0;",
                "vec4 s1 = floor(b1)*2.0 + 1.0;",
                "vec4 sh = -step(h, vec4(0.0));",

                "vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy;",
                "vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww;",

                "vec3 p0 = vec3(a0.xy,h.x);",
                "vec3 p1 = vec3(a0.zw,h.y);",
                "vec3 p2 = vec3(a1.xy,h.z);",
                "vec3 p3 = vec3(a1.zw,h.w);",

                //Normalise gradients
                "vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2, p2), dot(p3,p3)));",
                "p0 *= norm.x;",
                "p1 *= norm.y;",
                "p2 *= norm.z;",
                "p3 *= norm.w;",

                // Mix final noise value
                "vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);",
                "vec4 m2 = m * m;",
                "vec4 m4 = m2 * m2;",
                "vec4 pdotx = vec4(dot(p0,x0), dot(p1,x1), dot(p2,x2), dot(p3,x3));",

                // Determine noise gradient
                "vec4 temp = m2 * m * pdotx;",
                "gradient = -8.0 * (temp.x * x0 + temp.y * x1 + temp.z * x2 + temp.w * x3);",
                "gradient += m4.x * p0 + m4.y * p1 + m4.z * p2 + m4.w * p3;",
                "gradient *= 42.0;",

                "return 42.0 * dot(m4, pdotx);",
            "}"
        ].join("\n");
    }

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

            // Other inputs
            "uniform float time;",
            "uniform float harmonicAmplitude;",
            "uniform float harmonicWaveLength;",
            "uniform float harmonicSpeed;",
            "uniform float waveSharpness;",
            "uniform float harmonicDirectionAngle;",

            // Fragment shader input variables
            "varying vec2 TexCoords;",
            "varying vec3 Normal;",
            "varying vec3 FragPosition;",
            "varying float Time;",

            // Perlin noise function
            this.perlinNoise,

            "void main() {",
                // Compute the world position before generating the noise and wave functions
                "vec4 worldPos = modelView*vec4(vertPosition, 1.0);",

                // Compute wave direction
                "vec2 direction = vec2(sin(harmonicDirectionAngle), cos(harmonicDirectionAngle));",
                "vec2 xzRotated = vec2(worldPos.x*direction.x, worldPos.z*direction.y);",

                // Create a harmonic base for the wave with a sharp nonnegative sine function
                // Compute frequency based on the wave length (w = 2/L)
                "float harmonicFrequency = 2.0/harmonicWaveLength;",
                // Compute the phase based on the speed and frequency
                "float harmonicPhase = harmonicSpeed * harmonicFrequency;",
                "float theta = (xzRotated.x + xzRotated.y)*harmonicFrequency + harmonicPhase*time;",
                "float harmonicWave = 2.0*harmonicAmplitude*pow((sin(theta) + 1.0)/2.0, waveSharpness);",

                // Add three layers of perlin noise to the wave
                "float waveNoise = 5.0*snoise(0.005*vec3(worldPos.xz, 20.0*time));",
                "waveNoise += 0.25*snoise(0.1*vec3(worldPos.xz, 4.0*time));",

                // Add the noise and the harmonic wave together as the final wave function
                "float waveFunction = harmonicWave + waveNoise;",

                // Displace the surface y-coordinate (up/down)
                "vec3 displacedPosition = vec3(vertPosition.x, vertPosition.y + waveFunction, vertPosition.z);",

                // Compute the normal for the displaced surface
                "float A = waveSharpness*harmonicFrequency*harmonicAmplitude;",
                "float B = pow((sin(theta) + 1.0)/2.0, waveSharpness - 1.0);",
                "float C = cos(theta);",
                "float partialDerivativeX = direction.x*A*B*C;",
                "float partialDerivativeZ = direction.y*A*B*C;",

                // Compute the displaced normal
                "vec3 displacedNormal = normalize(vec3(-partialDerivativeX, 1.0, -partialDerivativeZ));",
                "Normal = normalize(mat3(modelView)*displacedNormal);",
                "vertNormal;",

                // Final transformation ( Perspective multiplied with the model view )
                "mat4 T = perspective * cameraView * modelView;",
                // Transform (x,y,z) vertex coordinates with the transform matrix
                "gl_Position = T * vec4(displacedPosition, 1.0);",

                // Fragment shader input variables
                "TexCoords = vertTexCoord;",
                "FragPosition = vec3(modelView * vec4(displacedPosition, 1.0));",

                // Pass over the time variable to fragment shader
                "Time = time;",
            "}"
        ].join("\n");
    }

    static get fragment () {
        return [
            "",
            "#ifdef GL_OES_standard_derivatives",
            "#extension GL_OES_standard_derivatives : enable",
            "#endif",
            "#ifdef GL_ES",
            // Float precision
            "precision highp float;",
            "#endif",
            // Fragment shader input variables
            "varying vec2 TexCoords;",
            "varying vec3 Normal;",
            "varying vec3 FragPosition;",
            "varying float Time;",

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
                "float specularStrength = 1.0;",
                "float shininess = 96.0;",
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

            "vec3 computeDiffuseSpecular(PointLight pointLight, vec3 viewDirection, vec3 normal) {",
                // Compute the vector from the pixel to the light source
                "vec3 lightDirection = normalize(pointLight.position - FragPosition);",
                // Diffuse lighting
                "float diff = max(dot(normal, lightDirection), 0.0);",
                "vec3 diffuse = (diff * pointLight.color * diffuseColor);",

                // Compute the vector of the reflected light based on the incoming light vector
                "vec3 reflectDirection = reflect(-lightDirection, normal);",
                // Specular lighting
                "vec3 specular = computeSpecularLight(viewDirection, reflectDirection, pointLight.color) * diff;",

                // Compute attenuation (intensity decrement over distance).
                "float attenuation = computeLightAttenuation(pointLight.position, pointLight.attenuationConstants);",

                // Phong lighting model
                "return (diffuse + specular) * attenuation;",
            "}",

            // 3D Perlin noise function
            this.perlinNoise,

            "void main() {",
                // Bump then fragment normal with four layers of perlin noise
                "float baseSpeed = 2.0;",
                "float baseFrequency = 0.5;",
                "vec3 gradient1 = vec3(0.0);",
                "float noise = sdnoise(baseFrequency*vec3(FragPosition.xz, Time*baseSpeed), gradient1);",
                "vec3 gradient2 = vec3(0.0);",
                "noise += 0.25*sdnoise(4.0*baseFrequency*vec3(FragPosition.xz, 0.25*Time*baseSpeed), gradient2);",
                "vec3 gradient3 = vec3(0.0);",
                "noise += 0.125*sdnoise(8.0*baseFrequency*vec3(FragPosition.xz, 0.125*Time*baseSpeed), gradient3);",
                "vec3 gradient4 = vec3(0.0);",
                "noise += 0.0625*sdnoise(16.0*baseFrequency*vec3(FragPosition.xz, 0.0625*Time*baseSpeed), gradient4);",

                "float bumpStrength = 0.05;",
                "vec3 bumb = normalize(0.5*gradient1 + mix(mix(gradient2, gradient3, 0.5), gradient4, 0.5));",
                "vec3 bumpedNormal = normalize(vec3(Normal + bumpStrength*bumb));",

                // Ambient lighting
                "float ambientStrength = 0.1;",
                "vec3 ambientColor = vec3(1.0, 1.0, 1.0);",
                "vec3 ambient = ambientStrength * ambientColor * diffuseColor;",

                // Compute the vector from the pixel to the camera
                "vec3 viewDirection = normalize(viewPosition - FragPosition);",

                // Add point light sources
                "vec3 phong = ambient;",
                "for(int i = 0; i < 10; i++) {",
                    "if (i > lightCount) break;",
                    "phong += computeDiffuseSpecular(pointLights[i], viewDirection, bumpedNormal);",
                "}",

                // Final shaded color (texture * lighting)
                "gl_FragColor = vec4 (phong, 1.0);",
            "}"
        ].join("\n");
    }
}

export default ProceduralShader;