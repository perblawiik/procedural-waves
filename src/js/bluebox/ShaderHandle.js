/**
 * Author: Per Blåwiik
 * Date: 2019-12-29
 */

class ShaderHandle {
    constructor(canvas, vertexShaderFile, fragmentShaderFile) {
        this.canvas = canvas;
        this.gl = this.canvas.getContext("webgl");

        // Set up the vertex and fragment shaders (glsl)
        let vertexShader = this.createShaderFromFile(this.gl.VERTEX_SHADER, vertexShaderFile);
        let fragmentShader = this.createShaderFromFile(this.gl.FRAGMENT_SHADER, fragmentShaderFile);

        // Attach shaders to our program
        this.program = this.createProgramFromShaders(vertexShader, fragmentShader);

        // Catches additional errors /
        /****(ONLY USED IN TESTING)****/
        this.gl.validateProgram(this.program);
        if(!this.gl.getProgramParameter(this.program, this.gl.VALIDATE_STATUS)) {
            console.error("ERROR validating program!", this.gl.getProgramInfoLog(this.program));
        }
        /****(ONLY USED IN TESTING)****/

        // Tell OpenGL state machine which program should be active
        this.gl.useProgram(this.program);

        // Save locations for communicating with the shader attributes
        this.fetchAttributeLocations();
        this.fetchUniformLocations();
    }

    activate () {
        this.gl.useProgram(this.program);
    }

    fetchAttributeLocations() {
        //Get attribute location from vertex shader text (glsl)
        this.positionAttributeLocation = this.gl.getAttribLocation(this.program, "vertPosition");
        this.normalAttributeLocation = this.gl.getAttribLocation(this.program, "vertNormal");
        this.textureAttributeLocation = this.gl.getAttribLocation(this.program, "vertTexCoord");
    }

    fetchUniformLocations() {
        // Matrix4f
        this.modelViewUniformLocation = this.gl.getUniformLocation(this.program, "modelView");
        this.cameraViewUniformLocation = this.gl.getUniformLocation(this.program, "cameraView");
        this.projectionMatrixUniformLocation = this.gl.getUniformLocation(this.program, "perspective");

        // Vector3f
        this.colorUniformLocation = this.gl.getUniformLocation(this.program, "diffuseColor");
        this.viewPositionUniformLocation = this.gl.getUniformLocation(this.program, "viewPosition");
    }

    createShaderFromFile(type, source) {
        let shader = this.gl.createShader(type);
        this.gl.shaderSource(shader, source);
        this.gl.compileShader(shader);

        // Check for errors
        if(this.gl.getShaderParameter(shader, this.gl.COMPILE_STATUS)) {
            return shader;
        }

        console.error("ERROR compiling shader!", this.gl.getShaderInfoLog(shader));
        this.gl.deleteShader(shader);
    }

    createProgramFromShaders(vertexShader, fragmentShader) {
        let program = this.gl.createProgram();
        this.gl.attachShader(program, vertexShader);
        this.gl.attachShader(program, fragmentShader);
        this.gl.linkProgram(program);

        // Check for errors
        if(this.gl.getProgramParameter(program, this.gl.LINK_STATUS)) {
            return program;
        }

        console.error("ERROR linking program!", this.gl.getProgramInfoLog(program));
        this.gl.deleteProgram(program);
    }

    setProjectionUniform(matrix) {
        this.gl.uniformMatrix4fv(this.projectionMatrixUniformLocation, this.gl.FALSE, matrix);
    }

    setCameraViewUniform(matrix) {
        this.gl.uniformMatrix4fv(this.cameraViewUniformLocation, this.gl.FALSE, matrix);
    }

    setCameraViewPosition(vector) {
        this.gl.uniform3fv(this.viewPositionUniformLocation, [vector.x, vector.y, vector.z]);
    }

    getUniformLoc(uniformName) {
        return this.gl.getUniformLocation(this.program, uniformName);
    }

    setUniformVec3f(location, vector) {
        this.gl.uniform3fv(location, [vector.x, vector.y, vector.z]);
    }

    setUniformVec2f(location, vector) {
        this.gl.uniform2fv(location, [vector[0], vector[1]]);
    }

    setUniformMat4f(location, matrix) {
        this.gl.uniformMatrix4fv(location, this.gl.FALSE, matrix);
    }

    setUniformFloatArray(location, array) {
        this.gl.uniform1fv(location, array);
    }

    setUniformVec3Array(location, array) {
        this.gl.uniform3fv(location, array);
    }

    setUniformInt(location, value) {
        this.gl.uniform1i(location, value);
    }

    setUniformFloat(location, value) {
        this.gl.uniform1f(location, value);
    }
}

export default ShaderHandle;