/**
 * Author: Per Blåwiik
 * Date: 2019-12-29
 */

class ShapeGenerator {
    static createCube(x = 1.0, y = 1.0, z = 1.0) {
        // Vertex coordinates, normals and texture coordinates
        let vertexArray = [
            // Vertex         Normal             Texture coordinates
            // Vertex 0
            -x, -y, -z,      0.0, -1.0,  0.0,     0.0, 1.0,
            -x, -y, -z,     -1.0,  0.0,  0.0,     0.0, 1.0,
            -x, -y, -z,      0.0,  0.0,  -1.0,    1.0, 1.0,

            // Vertex 1
            -x, -y,  z,     0.0, -1.0,  0.0,      0.0, 0.0,
            -x, -y,  z,     0.0,  0.0, 1.0,       0.0, 1.0,
            -x, -y,  z,    -1.0,  0.0,  0.0,      1.0, 1.0,

            // Vertex 2
            x, -y,  z,      0.0, -1.0,  0.0,      1.0, 0.0,
            x, -y,  z,      0.0,  0.0, 1.0,       1.0, 1.0,
            x, -y,  z,      1.0,  0.0,  0.0,      0.0, 1.0,

            // Vertex 3
            x, -y, -z,      0.0, -1.0,  0.0,      1.0, 1.0,
            x, -y, -z,      0.0,  0.0,  -1.0,     0.0, 1.0,
            x, -y, -z,      1.0,  0.0,  0.0,      1.0, 1.0,

            // Vertex 4
            -x, y, -z,     -1.0,  0.0,  0.0,      0.0, 0.0,
            -x, y, -z,      0.0,  0.0,  -1.0,     1.0, 0.0,
            -x, y, -z,      0.0,  1.0,  0.0,      0.0, 0.0,

            // Vertex 5
            -x, y, z,      0.0,  0.0, 1.0,        0.0, 0.0,
            -x, y, z,     -1.0,  0.0,  0.0,       1.0, 0.0,
            -x, y, z,      0.0,  1.0,  0.0,       0.0, 1.0,

            // Vertex 6
            x, y, z,       0.0,  0.0, 1.0,        1.0, 0.0,
            x, y, z,       1.0,  0.0,  0.0,       0.0, 0.0,
            x, y, z,       0.0,  1.0,  0.0,       1.0, 1.0,

            // Vertex 7
            x, y, -z,       0.0,  0.0,  -1.0,     0.0, 0.0,
            x, y, -z,       1.0,  0.0,  0.0,      1.0, 0.0,
            x, y, -z,       0.0,  1.0,  0.0,      1.0, 0.0
        ];

        // Vertex indices
        let indexArray = [
            // Bottom
            0, 9, 6,  // v0, v3, v2
            6, 3, 0,  // v2, v1, v0

            // Front
            4, 7, 18,  // v1, v2, v6
            18, 15, 4, // v6, v5, v1

            // Left
            1, 5, 16,  // v0, v1, v5
            16, 12, 1, // v5, v4, v0

            // Back
            2, 13, 21, // v0, v4, v7
            21, 10, 2, // v7, v3, v0

            // Right
            8, 11, 22, // v2, v3, v7
            22, 19, 8, // v7, v6, v2

            // Top
            14, 17, 20, // v4, v5, v6
            20, 23, 14  // v6, v7, v4
        ];

        let totalTriangles = 12;
        let totalVertices = totalTriangles*3;

        return {
            numVertices: totalVertices,
            vertices: vertexArray,
            indices: indexArray
        };
    }

    static createSphere(segments, radius) {
        let numHorizontalSegments = segments;
        // Minium amount of horizontal segments is 2
        if (numHorizontalSegments < 2) {
            numHorizontalSegments = 2;
        }

        // Number of vertical segments of the sphere
        let numVerticalSegments = 2 * numHorizontalSegments;
        let numVertices = 1 + (numHorizontalSegments - 1) * numVerticalSegments + 1; // top + middle + bottom
        let numTriangles = numVerticalSegments + (numHorizontalSegments - 2) * 4 * numHorizontalSegments + numVerticalSegments; // top + middle + bottom

        // Floats per row: position(x,y,z), normal(x,y,z), texture(s,t)
        let stride = 8;
        let vertices = []; // Initialize vertex array
        let indices = []; // Initialize index array

        /** Generate vertex array **/
        // Bottom vertex
        vertices[0] = 0.0; vertices[1] = -radius; vertices[2] = 0.0; // Coordinates
        vertices[3] = 0.0; vertices[4] = -1.0;    vertices[5] = 0.0; // Normal
        vertices[6] = 0.5; vertices[7] = 0.0;

        const PI = Math.PI;

        let sampleRate = PI / numHorizontalSegments; // Number of steps
        let theta = -PI + sampleRate; // Go from bottom to top (Y € -PI < theta < PI )
        let  phi = 0.0; // Begin at Z = 0 (Z € 0 < phi < 2PI )

        // Generate middle part vertices with normals
        let index = stride - 1; // Skip first 7 (the bottom vertex with normal and texture coordinates already specified)
        for (let i = 0; i < (numHorizontalSegments - 1); ++i) {
            let Y = Math.cos(theta); // Y-coordinate
            let R = Math.sin(theta); // XZ-plane

            phi = 0.0;
            for (let j = 0; j < numVerticalSegments; ++j) {
                // Vertex (x, y, z)
                vertices[++index] = radius * R * Math.sin(phi);
                vertices[++index] = radius * Y;
                vertices[++index] = radius * R * Math.cos(phi);
                // Normal (x, y, z)
                vertices[++index] = R * Math.sin(phi);
                vertices[++index] = Y;
                vertices[++index] = R * Math.cos(phi);
                // Texture Coordinates (s, t)
                vertices[++index] = phi / (2.0 * PI);
                vertices[++index] = 1.0 + (theta / PI);

                phi += sampleRate;
            }
            theta += sampleRate;
        }

        // Top vertex
        vertices[++index] = 0.0; vertices[++index] = radius; vertices[++index] = 0.0; // Coordinates
        vertices[++index] = 0.0; vertices[++index] = 1.0;    vertices[++index] = 0.0; // Normal
        vertices[++index] = 0.5; vertices[++index] = 1.0;

        /** Generate index array */
        // Bottom cap
        index = -1;
        for (let i = 0; i < numVerticalSegments; ++i) {
            indices[++index] = 0;
            if ((i + 2) <= numVerticalSegments) {
                indices[++index] = i + 2;
            }
            else {
                indices[++index] = (i + 2) - numVerticalSegments;
            }
            indices[++index] = i + 1;
        }

        // Middle part
        let v0 = 1;
        for (let i = 0; i < (numHorizontalSegments - 2); i++) {
            for (let j = 0; j < (numVerticalSegments - 1); ++j) {
                // One rectangle at a time (two triangles)
                indices[++index] = v0;
                indices[++index] = v0 + 1;
                indices[++index] = numVerticalSegments + v0;
                indices[++index] = v0 + 1;
                indices[++index] = numVerticalSegments + v0 + 1;
                indices[++index] = numVerticalSegments + v0;
                ++v0;
            }
            indices[++index] = v0;
            indices[++index] = (v0 + 1) - numVerticalSegments;
            indices[++index] = numVerticalSegments + v0;
            indices[++index] = (v0 + 1) - numVerticalSegments;
            indices[++index] = v0 + 1;
            indices[++index] = numVerticalSegments + v0;
            ++v0;
        }

        // Top cap
        let lastVertexIndex = numVertices - 1;
        for (let i = 0; i < numVerticalSegments; ++i) {
            indices[++index] = lastVertexIndex;
            if ((lastVertexIndex - 2 - i) >= lastVertexIndex - numVerticalSegments) {
                indices[++index] = lastVertexIndex - 2 - i;
            }
            else {
                indices[++index] = lastVertexIndex - numVerticalSegments - 1;
            }
            indices[++index] = lastVertexIndex - 1 - i;
        }
        indices[(numTriangles * 3) - 2] = (lastVertexIndex - 1);

        return {
            numVertices: indices.length,
            vertices: vertices,
            indices: indices
        };
    }

    static createCylinderSmooth (vertSegs, horizSegs, radius, height) {
        if (horizSegs < 1) {
            horizSegs = 1;
        }
        if (vertSegs < 4) {
            vertSegs = 4;
        }

        const stride = 8;
        let vertices = [];
        let indices = [];

        // Bottom center
        // Vertex coordinates
        vertices[0] = 0.0; vertices[1] = -(height / 2.0); vertices[2] = 0.0;
        // Normal coordinates
        vertices[3] = 0.0; vertices[4] = -1.0;            vertices[5] = 0.0;
        // Texture coordinates
        vertices[6] = 0.5; vertices[7] = 0.5;

        const PI = Math.PI;

        // Go from bottom to top (Y € -PI < theta < PI )
        let theta = -PI;
        // Begin at Z = 0 (Z € 0 < phi < 2PI )
        let phi = 0.0;

        // Start on index 7
        let index = stride - 1;
        // Generate vertices and normals for bottom circle plane (all normals should be (0.0, -1.0, 0.0))
        for (let j = 0; j < vertSegs; ++j) {
            // Vertex (x, y, z)
            vertices[++index] = radius * Math.sin(phi);
            vertices[++index] = -(height / 2.0); // The bottom circle is on the plane y = -height/2
            vertices[++index] = radius * Math.cos(phi);
            // Normal (x, y, z)
            vertices[++index] = 0.0;
            vertices[++index] = -1.0;
            vertices[++index] = 0.0;
            // Textures (s, t)
            vertices[++index] = Math.cos(phi) * 0.5 + 0.5;
            vertices[++index] = Math.sin(phi + PI) * 0.5 + 0.5;

            phi += (2.0 * PI) / vertSegs;
        }

        // Begin at Z = 0 (Z € 0 < phi < 2PI )
        phi = 0.0;
        // Generate middle part vertices with normals (from bottom to top)
        for (let i = 0; i < (horizSegs + 1); ++i) {
            let y = Math.cos(theta);
            for (let j = 0; j < vertSegs; ++j) {
                // Vertex (x, y, z)
                vertices[++index] = radius * Math.sin(phi);
                vertices[++index] = (height / 2.0) * y;
                vertices[++index] = radius * Math.cos(phi);
                // Normal (x, y, z)
                vertices[++index] = Math.sin(phi);
                vertices[++index] = y;
                vertices[++index] = Math.cos(phi);
                // Textures (s, t)
                vertices[++index] = phi/(2.0*PI);
                vertices[++index] = Math.abs(y * 0.5 - 0.5);

                phi += (2.0 * PI) / vertSegs;
            }
            phi = 0.0;
            theta += PI / horizSegs;
        }

        phi = 0.0;
        // Generate vertices and normals for top circle plane (all normals should be (0.0, 1.0, 0.0))
        for (let j = 0; j < vertSegs; ++j) {
            // Vertex (x, y, z)
            vertices[++index] = radius * Math.sin(phi);
            vertices[++index] = (height / 2.0);
            vertices[++index] = radius * Math.cos(phi);
            // Normal (x, y, z)
            vertices[++index] = 0.0;
            vertices[++index] = 1.0;
            vertices[++index] = 0.0;
            // Textures (s, t)
            vertices[++index] = Math.cos(phi) * 0.5 + 0.5;
            vertices[++index] = Math.sin(phi + PI) * 0.5 + 0.5;

            phi += (2.0 * PI) / vertSegs;
        }

        // Top center vertex, normal and texture coordinates
        vertices[++index] = 0.0; vertices[++index] = (height / 2.0); vertices[++index] = 0.0;
        vertices[++index] = 0.0; vertices[++index] = 1.0;            vertices[++index] = 0.0;
        vertices[++index] = 0.5; vertices[++index] = 0.5;

        /* Generate Index Array */
        // Bottom circle plane
        index = -1;
        for (let i = 0; i < vertSegs; ++i) {
            indices[++index] = 0;
            if ((i + 2) <= vertSegs) {
                indices[++index] = i + 2;
            }
            else {
                indices[++index] = (i + 2) - vertSegs;
            }
            indices[++index] = i + 1;
        }

        // Middle part
        let v0 = vertSegs + 1;
        for (let i = 0; i < horizSegs; i++) {
            for (let j = 0; j < (vertSegs - 1); ++j) {
                // One rectangle at a time (two triangles)
                indices[++index] = v0;
                indices[++index] = v0 + 1;
                indices[++index] = vertSegs + v0;
                indices[++index] = v0 + 1;
                indices[++index] = vertSegs + v0 + 1;
                indices[++index] = vertSegs + v0;
                ++v0;
            }
            indices[++index] = v0;
            indices[++index] = (v0 + 1) - vertSegs;
            indices[++index] = vertSegs + v0;
            indices[++index] = (v0 + 1) - vertSegs;
            indices[++index] = v0 + 1;
            indices[++index] = vertSegs + v0;
            ++v0;
        }

        let numVertices = (4 * vertSegs) + 2 + (vertSegs * (horizSegs - 1));
        // Top circle plane
        let lastVertexIndex = numVertices - 1;
        for (let i = 0; i < vertSegs; ++i) {
            indices[++index] = lastVertexIndex;
            if ((lastVertexIndex - 2 - i) >= lastVertexIndex - vertSegs) {
                indices[++index] = lastVertexIndex - 2 - i;
            }
            else {
                indices[++index] = lastVertexIndex - 1;
            }
            indices[++index] = lastVertexIndex - 1 - i;
        }

        return {
            numVertices: indices.length,
            vertices: vertices,
            indices: indices
        };
    }

    static createCylinderSharp(vertSegs, radius, height) {
        const horizSegs = 1;

        if (vertSegs < 4) {
            vertSegs = 4;
        }
        const stride = 8;
        let vertices = [];
        let indices = [];

        // Bottom center
        // Vertex coordinates
        vertices[0] = 0.0; vertices[1] = -(height / 2.0); vertices[2] = 0.0;
        // Normal coordinates
        vertices[3] = 0.0; vertices[4] = -1.0;            vertices[5] = 0.0;
        // Texture coordinates
        vertices[6] = 0.5; vertices[7] = 0.5;

        const PI = Math.PI;

        // Go from bottom to top (Y € -PI < theta < PI )
        let theta = -PI;
        // Begin at Z = 0 (Z € 0 < phi < 2PI )
        let phi = 0.0;

        let index = stride - 1;
        // Generate vertices and normals for bottom circle plane (all normals should be (0.0, -1.0, 0.0))
        for (let j = 0; j < vertSegs; ++j) {
            // Vertex (x, y, z)
            vertices[++index] = radius * Math.sin(phi);
            vertices[++index] = -(height / 2.0); // The bottom circle is on the plane y = -height/2
            vertices[++index] = radius * Math.cos(phi);
            // Normal (x, y, z)
            vertices[++index] = 0.0;
            vertices[++index] = -1.0;
            vertices[++index] = 0.0;
            // Textures (s, t)
            vertices[++index] = Math.cos(phi) * 0.5 + 0.5;
            vertices[++index] = Math.sin(phi + PI) * 0.5 + 0.5;

            phi += (2.0 * PI) / vertSegs;
        }

        // Begin at Z = 0 (Z € 0 < phi < 2PI )
        phi = 0.0;
        // Generate middle part vertices with normals (from bottom to top)
        for (let i = 0; i < (horizSegs + 1); ++i) {
            let y = Math.cos(theta);
            // Two vertices each iteration which belong to the same face
            for (let j = 0; j < vertSegs; ++j) {
                let phiNext = phi + (2.0 * PI) / vertSegs;
                // First Vertex
                // Vertex (x, y, z)
                vertices[++index] = radius * Math.sin(phi);
                vertices[++index] = (height / 2.0) * y;
                vertices[++index] = radius * Math.cos(phi);
                // Normal (x, y, z)
                vertices[++index] = Math.sin(phi) + Math.sin(phiNext);
                vertices[++index] = y + y;
                vertices[++index] = Math.cos(phi) + Math.cos(phiNext);

                // Textures (s, t)
                vertices[++index] = phi / (2.0*PI);
                vertices[++index] = Math.abs(y * 0.5 - 0.5);

                // Second Vertex
                // Vertex (x, y, z)
                vertices[++index] = radius * Math.sin(phiNext);
                vertices[++index] = (height / 2.0) * y;
                vertices[++index] = radius * Math.cos(phiNext);
                // Normal (x, y, z)
                vertices[++index] = Math.sin(phi) + Math.sin(phiNext);
                vertices[++index] = y + y;
                vertices[++index] = Math.cos(phi) + Math.cos(phiNext);

                // Textures (s, t)
                vertices[++index] = phiNext / (2.0*PI);
                vertices[++index] = Math.abs(y * 0.5 - 0.5);

                phi = phiNext;
            }
            vertices[index - 1] = 1.0; // Last vertex s-texture coordinate is always 1

            phi = 0.0;
            theta += PI / horizSegs;
        }

        // Reset phi to 0
        phi = 0.0;
        // Generate vertices and normals for top circle plane (all normals should be (0.0, 1.0, 0.0))
        for (let j = 0; j < vertSegs; ++j) {
            // Vertex (x, y, z)
            vertices[++index] = radius * Math.sin(phi);
            vertices[++index] = (height / 2.0);
            vertices[++index] = radius * Math.cos(phi);
            // Normal (x, y, z)
            vertices[++index] = 0.0;
            vertices[++index] = 1.0;
            vertices[++index] = 0.0;
            // Textures (s, t)
            vertices[++index] = Math.cos(phi) * 0.5 + 0.5;
            vertices[++index] = Math.sin(phi + PI) * 0.5 + 0.5;

            phi += (2.0 * PI) / vertSegs;
        }

        // Top center vertex, normal and texture coordinates
        vertices[++index] = 0.0; vertices[++index] = (height / 2.0); vertices[++index] = 0.0;
        vertices[++index] = 0.0; vertices[++index] = 1.0;            vertices[++index] = 0.0;
        vertices[++index] = 0.5; vertices[++index] = 0.5;

        /* Generate Index Array */
        // Bottom circle plane
        index = -1;
        for (let i = 0; i < vertSegs; ++i) {
            indices[++index] = 0;

            if ((i + 2) <= vertSegs) {
                indices[++index] = i + 2;
            }
            else {
                indices[++index] = (i + 2) - vertSegs;
            }

            indices[++index] = i + 1;
        }

        // Middle part
        let v0 = vertSegs + 1;
        for (let i = 0; i < horizSegs; i++) {
            for (let j = 0; j < vertSegs; ++j) {
                // One rectangle at a time (two triangles)
                indices[++index] = v0;
                indices[++index] = v0 + 1;
                indices[++index] = 2 * vertSegs + v0;

                indices[++index] = v0 + 1;
                indices[++index] = 2* vertSegs + v0 + 1;
                indices[++index] = 2 * vertSegs + v0;
                v0 = v0 + 2;
            }
        }

        // Top circle plane
        let numVertices = 6 * vertSegs + 2;
        let lastVertexIndex = numVertices - 1;
        for (let i = 0; i < vertSegs; ++i) {
            indices[++index] = lastVertexIndex;

            if ((lastVertexIndex - 2 - i) >= lastVertexIndex - vertSegs) {
                indices[++index] = lastVertexIndex - 2 - i;
            }
            else {
                indices[++index] = lastVertexIndex - 1;
            }

            indices[++index] = lastVertexIndex - 1 - i;
        }

        return {
            numVertices: indices.length,
            vertices: vertices,
            indices: indices
        };
    }

    static createPlane (WIDTH, HEIGHT, textureWidth = -1.0, textureHeight = -1.0) {
        // Textire coordiantes
        let s, t;
        if (textureWidth > 0.0001) {
            s = WIDTH / textureWidth;
        }
        else {
            s = 1.0;
        }

        if (textureHeight > 0.0001) {
            t = HEIGHT / textureHeight;
        }
        else {
            t = 1.0;
        }

        let vertexData = [
            // Position Coordinates                 // Normals       // Texture coordinates
            -(WIDTH / 2.0), 0.0, -(HEIGHT / 2.0),   0.0, 1.0, 0.0,   0.0, 0.0, // Upper left
             (WIDTH / 2.0), 0.0, -(HEIGHT / 2.0),   0.0, 1.0, 0.0,   s, 0.0, // Upper right
             (WIDTH / 2.0), 0.0,  (HEIGHT / 2.0),   0.0, 1.0, 0.0,   s, t, // Lower right
            -(WIDTH / 2.0), 0.0,  (HEIGHT / 2.0),   0.0, 1.0, 0.0,   0.0, t  // Lower left
        ];

        let indexData = [
            0, 2, 1, // First triangle
            0, 3, 2 // Second triangle
        ];

        let numVertices = 4;
        let numTriangles = 2;
        let stride = 8;
        console.log("Vertices before: " + (numVertices * stride));
        let vertices = [];
        console.log("Vertices before: " + (numTriangles * 3));
        let indices = [];

        for (let i = 0; i < (numVertices * stride); ++i) {
            vertices[i] = vertexData[i];
        }

        for (let i = 0; i < (numTriangles * 3); ++i) {
            indices[i] = indexData[i];
        }

        return {
            numVertices: numVertices,
            vertices: vertices,
            indices: indices
        };
    }
}

export default ShapeGenerator;