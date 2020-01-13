/**
 * Author: Per Blåwiik
 * Date: 2019-12-29
 */

import Vector3 from './Vector3';

class Matrix4 {
    // Returns an identity matrix
    static identity () {
        return [
            1, 0, 0, 0,
            0, 1, 0, 0,
            0, 0, 1, 0,
            0, 0, 0, 1
        ];
    }

    // Returns a translation matrix
    static translation (tX, tY, tZ) {
        return [
            1,  0,  0,  0,
            0,  1,  0,  0,
            0,  0,  1,  0,
            tX, tY, tZ, 1
        ];
    }

    // Returns a scaling matrix
    static scaling (xScale, yScale, zScale) {
        return [
            xScale, 0,      0,      0,
            0,      yScale, 0,      0,
            0,      0,      zScale, 0,
            0,      0,      0,      1
        ];
    }

    static compose (xVec, yVec, zVec, posVec = new Vector3([0.0, 0.0, 0.0])) {
        return [
            xVec.x,    yVec.x,   zVec.x,   0,
            xVec.y,    yVec.y,   zVec.y,   0,
            xVec.z,    yVec.z,   zVec.z,   0,
            posVec.x, posVec.y, posVec.z,  1,
        ];
    }

    // Returns a rotation matrix for the x-axis
    static rotationX (rad) {
        let sin = Math.sin(rad);
        let cos = Math.cos(rad);
        return [
            1,  0,   0,   0,
            0,  cos, sin, 0,
            0, -sin, cos, 0,
            0,  0,   0,   1
        ];
    }

    // Returns a rotation matrix for the y-axis
    static rotationY (rad) {
        let sin = Math.sin(rad);
        let cos = Math.cos(rad);
        return [
            cos, 0, -sin, 0,
            0,   1,  0,   0,
            sin, 0,  cos, 0,
            0,   0,  0,   1
        ];
    }

    // Returns a rotation matrix for the z-axis
    static rotationZ (rad) {
        let sin = Math.sin(rad);
        let cos = Math.cos(rad);
        return [
            cos, sin, 0, 0,
            -sin, cos, 0, 0,
            0,   0,   1, 0,
            0,   0,   0, 1
        ];
    }

    // Returns a perspective matrix
    static perspective (fovy, aspect, near, far) {
        let f = 1.0 / Math.tan(fovy/2);
        let nf = 1 / (near-far);

        return [
            f/aspect, 0, 0,              0,
            0,        f, 0,              0,
            0,        0, (far+near)*nf, -1,
            0,        0, 2*far*near*nf,  0
        ];
    }

    // Translates a given matrix with given coordinates and returns the matrix combination
    static translate (matrix, tX, tY, tZ) {
        return this.multiply(this.translation(tX, tY, tZ), matrix);
    }

    // Scales a given matrix with given dimensions and returns the matrix combination
    static scale (matrix, sX, sY, sZ) {
        return this.multiply(this.scaling(sX, sY, sZ), matrix);
    }

    // Rotates a given matrix with given angle in radians and returns the matrix combination
    static rotateX (matrix, rad) {
        return this.multiply(this.rotationX(rad), matrix);
    }

    // Rotates a given matrix with given angle in radians and returns the matrix combination
    static rotateY (matrix, rad) {
        return this.multiply(this.rotationY(rad), matrix);
    }

    // Rotates a given matrix with given angle in radians and returns the matrix combination
    static rotateZ (matrix, rad) {
        return this.multiply(this.rotationZ(rad), matrix);
    }

    // Multiplies a given 4x4-matrix with given 4x1 vector and returns 4x1 vector
    static multiplyVector (m, v) {
        let out = [];
        out[0] = m[0]*v[0] + m[4]*v[1] + m[8]*v[2]  + m[12]*v[3];
        out[1] = m[1]*v[0] + m[5]*v[1] + m[9]*v[2]  + m[13]*v[3];
        out[2] = m[2]*v[0] + m[6]*v[1] + m[10]*v[2] + m[14]*v[3];
        out[3] = m[3]*v[0] + m[7]*v[1] + m[11]*v[2] + m[15]*v[3];
        return out;
    }

    // Performs a matrix multiplication with two given matrices and returns the matrix combination
    static multiply (a, b) {
        let out =
            [
                0, 0, 0, 0,
                0, 0, 0, 0,
                0, 0, 0, 0,
                0, 0, 0, 0
            ];
        let index = 0;
        let i = 0;

        while (i < 16) {
            // Each column
            for (let k = 0; k < 4; ++k) {
                out[index] = (a[k]*b[i]) + (a[k+4]*b[i+1]) + (a[k+8]*b[i+2]) + (a[k+12]*b[i+3]);
                ++index;
            }
            i = i + 4; // Jump to next row (go pass 4 indexes)
        }

        return out;
    }

    /**
     * Inverts a mat4
     *
     * @param {mat4} out the receiving matrix
     * @param {mat4} a the source matrix
     * @returns {mat4} out
     *
     * Source: https://github.com/toji/gl-matrix/blob/master/src/mat4.js
     */
    static invert (out, a) {
        let a00 = a[0],
            a01 = a[1],
            a02 = a[2],
            a03 = a[3];
        let a10 = a[4],
            a11 = a[5],
            a12 = a[6],
            a13 = a[7];
        let a20 = a[8],
            a21 = a[9],
            a22 = a[10],
            a23 = a[11];
        let a30 = a[12],
            a31 = a[13],
            a32 = a[14],
            a33 = a[15];

        let b00 = a00 * a11 - a01 * a10;
        let b01 = a00 * a12 - a02 * a10;
        let b02 = a00 * a13 - a03 * a10;
        let b03 = a01 * a12 - a02 * a11;
        let b04 = a01 * a13 - a03 * a11;
        let b05 = a02 * a13 - a03 * a12;
        let b06 = a20 * a31 - a21 * a30;
        let b07 = a20 * a32 - a22 * a30;
        let b08 = a20 * a33 - a23 * a30;
        let b09 = a21 * a32 - a22 * a31;
        let b10 = a21 * a33 - a23 * a31;
        let b11 = a22 * a33 - a23 * a32;

        // Calculate the determinant
        let det = b00 * b11 - b01 * b10 + b02 * b09 + b03 * b08 - b04 * b07 + b05 * b06;

        if (!det) {
            return null;
        }
        det = 1.0 / det;

        out[0] = (a11 * b11 - a12 * b10 + a13 * b09) * det;
        out[1] = (a02 * b10 - a01 * b11 - a03 * b09) * det;
        out[2] = (a31 * b05 - a32 * b04 + a33 * b03) * det;
        out[3] = (a22 * b04 - a21 * b05 - a23 * b03) * det;
        out[4] = (a12 * b08 - a10 * b11 - a13 * b07) * det;
        out[5] = (a00 * b11 - a02 * b08 + a03 * b07) * det;
        out[6] = (a32 * b02 - a30 * b05 - a33 * b01) * det;
        out[7] = (a20 * b05 - a22 * b02 + a23 * b01) * det;
        out[8] = (a10 * b10 - a11 * b08 + a13 * b06) * det;
        out[9] = (a01 * b08 - a00 * b10 - a03 * b06) * det;
        out[10] = (a30 * b04 - a31 * b02 + a33 * b00) * det;
        out[11] = (a21 * b02 - a20 * b04 - a23 * b00) * det;
        out[12] = (a11 * b07 - a10 * b09 - a12 * b06) * det;
        out[13] = (a00 * b09 - a01 * b07 + a02 * b06) * det;
        out[14] = (a31 * b01 - a30 * b03 - a32 * b00) * det;
        out[15] = (a20 * b03 - a21 * b01 + a22 * b00) * det;

        return out;
    }

    /**
     * Rotates a mat4 by the given angle around the given axis
     *
     * @param {mat4} out the receiving matrix
     * @param {mat4} a the matrix to rotate
     * @param {Number} rad the angle to rotate the matrix by
     * @param {Vector3} axis the axis to rotate around
     * @returns {mat4} out
     *
     * Source: https://github.com/toji/gl-matrix/blob/master/src/mat4.js
     */
    static rotate (out, a, rad, axis) {
        let x = axis.x,
            y = axis.y,
            z = axis.z;
        let len = Math.sqrt(x * x + y * y + z * z);
        let s = void 0,
            c = void 0,
            t = void 0;
        let a00 = void 0,
            a01 = void 0,
            a02 = void 0,
            a03 = void 0;
        let a10 = void 0,
            a11 = void 0,
            a12 = void 0,
            a13 = void 0;
        let a20 = void 0,
            a21 = void 0,
            a22 = void 0,
            a23 = void 0;
        let b00 = void 0,
            b01 = void 0,
            b02 = void 0;
        let b10 = void 0,
            b11 = void 0,
            b12 = void 0;
        let b20 = void 0,
            b21 = void 0,
            b22 = void 0;

        if (Math.abs(len) < 0.001) {
            return null;
        }

        len = 1 / len;
        x *= len;
        y *= len;
        z *= len;

        s = Math.sin(rad);
        c = Math.cos(rad);
        t = 1 - c;

        a00 = a[0];a01 = a[1];a02 = a[2];a03 = a[3];
        a10 = a[4];a11 = a[5];a12 = a[6];a13 = a[7];
        a20 = a[8];a21 = a[9];a22 = a[10];a23 = a[11];

        // Construct the elements of the rotation matrix
        b00 = x * x * t + c; b01 = y * x * t + z * s; b02 = z * x * t - y * s;
        b10 = x * y * t - z * s; b11 = y * y * t + c; b12 = z * y * t + x * s;
        b20 = x * z * t + y * s; b21 = y * z * t - x * s; b22 = z * z * t + c;

        // Perform rotation-specific matrix multiplication
        out[0] = a00 * b00 + a10 * b01 + a20 * b02;
        out[1] = a01 * b00 + a11 * b01 + a21 * b02;
        out[2] = a02 * b00 + a12 * b01 + a22 * b02;
        out[3] = a03 * b00 + a13 * b01 + a23 * b02;
        out[4] = a00 * b10 + a10 * b11 + a20 * b12;
        out[5] = a01 * b10 + a11 * b11 + a21 * b12;
        out[6] = a02 * b10 + a12 * b11 + a22 * b12;
        out[7] = a03 * b10 + a13 * b11 + a23 * b12;
        out[8] = a00 * b20 + a10 * b21 + a20 * b22;
        out[9] = a01 * b20 + a11 * b21 + a21 * b22;
        out[10] = a02 * b20 + a12 * b21 + a22 * b22;
        out[11] = a03 * b20 + a13 * b21 + a23 * b22;

        if (a !== out) {
            // If the source and destination differ, copy the unchanged last row
            out[12] = a[12];
            out[13] = a[13];
            out[14] = a[14];
            out[15] = a[15];
        }
        return out;
    }
}

export default Matrix4;