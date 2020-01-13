/**
 * Author: Per Blåwiik
 * Date: 2019-12-29
 */

import Transform from "./Transform";
import ShapeGenerator from "./ShapeGenerator";

class Mesh {
    constructor(gl) {
        this.gl = gl;

        this.totalVertices = 0;

        this.color = [0.5, 0.5, 0.5];
        this.drawMode = this.gl.TRIANGLES;

        this.transform = new Transform();
    }

    setDrawMode(drawMode) {
        this.drawMode = drawMode;
    }

    setColor(color) {
        this.color = color;
    }

    setPosition(pos) {
        this.transform.setPosition(pos);
    }

    setScale (scale) {
        this.transform.setScale(scale);
    }

    setRotation (rot) {
        this.transform.setRotation(rot);
    }

    render(shader) {
        if (this.shape) {
            // Activate the shader
            shader.activate();
            // Set shader uniforms for this mesh
            this.bindBuffersAndEnableAttributes(shader);
            this.updateUniforms(shader);
            // Draw our graphics
            // Param 1 specifies how to draw from vertices,
            // param 2 is how many vertices we use to draw
            // param 3 is what type the elements are
            // param 4 is the starting point from the array
            this.gl.drawElements(this.drawMode, this.totalVertices, this.gl.UNSIGNED_SHORT, 0);

            this.unbindBuffers();
        }
        else {
            console.log("ERROR! The mesh got no shape!");
        }
    }

    updateUniforms(shader) {
        this.gl.uniformMatrix4fv(shader.modelViewUniformLocation, this.gl.FALSE, this.transform.matrix);
        this.gl.uniform3fv(shader.colorUniformLocation, this.color);
    }

    unbindBuffers() {
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, null);
        this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, null);
    }

    bindBuffersAndEnableAttributes(shader) {
        // Vertex buffer
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.vertexBuffer);

        // Enable vertex attribute
        this.gl.vertexAttribPointer(
            shader.positionAttributeLocation, // Attribute location
            3, // Number of elements per iteration (x,y,z)
            this.gl.FLOAT, // Type of elements (32bit floats)
            this.gl.FALSE, // Don't normalize the data
            8 * Float32Array.BYTES_PER_ELEMENT, // how many bytes to move to the next vertex
            0// Offset from the beginning of a single vertex to this attribute
        );
        this.gl.enableVertexAttribArray(shader.positionAttributeLocation);

        // Enable normal attribute
        this.gl.vertexAttribPointer(
            shader.normalAttributeLocation, // Attribute location
            3, // Number of elements per iteration (x,y,z)
            this.gl.FLOAT, // Type of elements (32bit floats)
            this.gl.TRUE, // Not normalized
            8 * Float32Array.BYTES_PER_ELEMENT, // how many bytes to move to the next normal
            3 * Float32Array.BYTES_PER_ELEMENT// Offset from the beginning of a single vertex to this attribute
        );
        this.gl.enableVertexAttribArray(shader.normalAttributeLocation);

        // Index buffer
        this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer);
    }

    createBuffers(vertices, indices) {
        // Create vertex and normal buffer
        this.vertexBuffer = this.gl.createBuffer();
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.vertexBuffer);
        this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(vertices), this.gl.STATIC_DRAW);

        // Create index buffer
        this.indexBuffer = this.gl.createBuffer();
        this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer);
        this.gl.bufferData(this.gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices), this.gl.STATIC_DRAW);

        // Unbind buffers
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, null);
        this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, null);
    }

    createCylinderSmooth (vertSeg, horizSeg, radius, height) {
        this.shape = 'cylinder';

        let cylinderData = ShapeGenerator.createCylinderSmooth(vertSeg, horizSeg, radius, height);
        this.totalVertices = cylinderData.numVertices;

        // Create vertex and normal buffer
        this.vertexBuffer = this.gl.createBuffer();
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.vertexBuffer);
        this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(cylinderData.vertices), this.gl.STATIC_DRAW);

        // Create index buffer
        this.indexBuffer = this.gl.createBuffer();
        this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer);
        this.gl.bufferData(this.gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(cylinderData.indices), this.gl.STATIC_DRAW);

        // Unbind buffers
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, null);
        this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, null);
    }

    createCylinderSharp (vertSegs, radius, height) {
        this.shape = 'cylinder';

        let cylinderData = ShapeGenerator.createCylinderSharp(vertSegs, radius, height);
        this.totalVertices = cylinderData.numVertices;

        this.createBuffers(cylinderData.vertices, cylinderData.indices);
    }

    createSphere (segments) {
        this.shape = 'sphere';

        let sphereData = ShapeGenerator.createSphere(segments, 1.0);
        this.totalVertices = sphereData.numVertices;

        this.createBuffers(sphereData.vertices, sphereData.indices);
    }

    createCube() {
        this.shape = 'cube';
        let cubeData = ShapeGenerator.createCube();
        this.totalVertices = cubeData.numVertices;

        this.createBuffers(cubeData.vertices, cubeData.indices);
    }

    createPlane (rows, columns) {
        this.shape = 'plane';

        let index = 0;
        let x = 0;
        let vertexArray = [];
        // Generate and store coordinates in vertex array
        for (let i = 0; i <= columns; ++i) {
            x = -(rows/2);
            for (let k = 0; k <= rows; ++k) {
                // Storing one vertex at the time (x,y,z)
                vertexArray[index] = x;
                vertexArray[index+1] = 0; // y will always be 0 since the floor is flat (xz-plane is being used)
                vertexArray[index+2] = -i;

                // Set normals
                vertexArray[index+3] = 0.0;
                vertexArray[index+4] = 1.0;
                vertexArray[index+5] = 0.0;

                // Texture coordinates
                vertexArray[index+6] = 0.0;
                vertexArray[index+7] = 0.0;

                // We go from left to right in the direction of x-axis
                ++x;
                // Increase by three since we store values in three indices at the time
                index += 8;
            }
        }

        // v0-v3 represent the four vertices in one quad
        let v0 = 0;
        let v1 = 1;
        let v2 = rows+2;
        let v3 = rows+1;
        index = 0;
        let indexArray = [];
        // Store indices in index array
        for (let j = 0; j < columns; ++j) {
            // Each iteration generates the order of vertex indices for one full quad
            for (let l = 0; l < rows; ++l) {
                // Triangle 1
                indexArray[index] = v0;
                indexArray[index + 1] = v1;
                indexArray[index + 2] = v2;
                // Triangle 2
                indexArray[index + 3] = v2;
                indexArray[index + 4] = v3;
                indexArray[index + 5] = v0;

                // Increase for next quad
                ++v0;
                ++v1;
                ++v2;
                ++v3;
                index += 6;
            }
            // Increase one more time after a full row of quads
            ++v0;
            ++v1;
            ++v2;
            ++v3;
        }
        //this.totalTriangles = rows*columns*2;
        //this.totalVertices = this.totalTriangles*3;
        this.totalVertices = indexArray.length;

        this.createBuffers(vertexArray, indexArray);
    };

    createLine (vertices, indices) {
        this.shape = "LINE";
        this.totalVertices = indices.length;


        this.createBuffers(vertices, indices);
    }
}

export default Mesh;