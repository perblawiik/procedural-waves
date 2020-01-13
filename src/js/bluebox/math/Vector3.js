class Vector3 {
    constructor(coordinates) {
        this.set(coordinates);
    }

    get x () {
        return this.v1;
    }

    get y () {
        return this.v2;
    }

    get z () {
        return this.v3;
    }

    get r () {
        return this.v1;
    }

    get g () {
        return this.v2;
    }

    get b () {
        return this.v3;
    }

    set(coords) {
        this.v1 = coords[0];
        this.v2 = coords[1];
        this.v3 = coords[2];
    }

    clone() {
        return new Vector3([this.x, this.y, this.z]);
    }

    inverted() {
        return new Vector3 ([-this.x, -this.y, -this.z]);
    }

    get magnitude() {
        return Math.sqrt(this.v1*this.v1 + this.v2*this.v2 + this.v3*this.v3);
    }

    normalized() {
        let out = new Vector3([0.0, 0.0, 0.0]);

        // Set length of vector to 1
        let magnitude = Math.sqrt(this.x*this.x + this.y*this.y + this.z*this.z);
        if (magnitude > 0.001) {
            out.set([
                this.v1/magnitude,
                this.v2/magnitude,
                this.v3/magnitude
            ]);
        }
        else {
            out.set([
                0.0,
                0.0,
                0.0
            ]);
        }

        return out;
    }

    divideBy(scalar) {
        this.v1 /= scalar;
        this.v2 /= scalar;
        this.v3 /= scalar;

        return this;
    }

    multipleBy(scalar) {
        this.v1 *= scalar;
        this.v2 *= scalar;
        this.v3 *= scalar;

        return this;
    }

    static distance(a, b) {
        return Math.sqrt(
            (b.v1-a.v1)*(b.v1-a.v1) +
            (b.v2-a.v2)*(b.v2-a.v2) +
            (b.v3-a.v3)*(b.v3-a.v3)
        );
    }

    static add (A, B) {
        return new Vector3 ([
            A.v1 + B.v1,
            A.v2 + B.v2,
            A.v3 + B.v3
        ]);
    }

    static subtract (A, B) {
        return new Vector3 ([
            A.v1 - B.v1,
            A.v2 - B.v2,
            A.v3 - B.v3
        ]);
    }

    static crossProduct (A, B) {
        return new Vector3 ([
            (A.y*B.z - A.z*B.y),
            -(A.x*B.z - A.z*B.x),
            (A.x*B.y - A.y*B.x)
        ]);
    }

    static dot (A, B) {
        return (A.v1*B.v1) + (A.v2*B.v2) + (A.v3*B.v3);
    }

    static up() {
        return new Vector3([0.0, 1.0, 0.0]);
    }

    static down() {
        return new Vector3([0.0, -1.0, 0.0]);
    }

    static forward() {
        return new Vector3([0.0, 0.0, 1.0]);
    }

    static backwards () {
        return new Vector3([0.0, 0.0, -1.0]);
    }

    static left() {
        return new Vector3([-1.0, 0.0, 0.0]);
    }

    static right() {
        return new Vector3([1.0, 0.0, 0.0]);
    }
}

export default Vector3;