import { IVector, Vec } from "../../types/Math/Vec";

export default class Vector<N extends Dimension> implements IVector<N> {
    vec: Vec<N>;
    size: N;
    length: number;
    I: number = 1;
    J: number = 1;
    K: number = 1;

    public constructor(size: N) {
        this.size = size;
        this.length = 0;
        let vec;
        switch (size) {
            case 4:
                vec = [0,0,0,0]
                break;
            case 3: 
                vec = [0,0,0]
                break;
            case 2:
                vec = [0,0]
                break;

            default:
                vec = [0,0]
        }
        this.vec = vec as Vec<N>;
    }

    private absOnZero(value: number): number {
        return value === -0 || value === 0 ? 0 : value;
    }

    private calculateLength(): number {
        let res = 0;
        for (let i = 0; i < this.size; i++) {
            res += (this.vec[i]**2)
        }
        return (Math.sqrt(res));
    }

    public cross(vector: N extends 3 ? Vector<N> : never): N extends 3 ? Vector<N> : never {
        if (this.size !== 3) {
            throw new Error("ERROR: Cross product not possible for vectors with dimensions other than 3.")
        }
        //@ts-ignore
        return new Vector(3).set([this.absOnZero(this.I *(this.vec[1]*vector.vec[2]) - (this.vec[2]*vector.vec[1])), this.absOnZero((-this.J) * ((this.vec[0]*vector.vec[2]) - (this.vec[2]*vector.vec[0]))), this.absOnZero(this.K * ((this.vec[0]*vector.vec[1]) - (this.vec[1]*vector.vec[0])))] as Vec<N>);
    }

    public dot(vector: Vector<N>): number {
        let res = 0;
        for (let i = 0; i < this.size; i++) {
            res += this.vec[i] * vector.vec[i];
        }
        return res;
    }

    public normalize(): Vector<N> {
        for (let i = 0; i < this.size; i++) {
            this.vec[i] = (this.vec[i] / this.length)
        }
        this.length = Math.ceil(this.calculateLength());
        return this;
    }

    public add(vector: Vector<N>): Vector<N> {
        let res = Array(this.size).fill(0);
        for (let i = 0; i < this.size; i++) {
            res[i] += this.vec[i] + vector.vec[i];
        }
        this.vec = res as Vec<N>;
        this.length = this.calculateLength();
        return this;
    }

    public subtract(vector: Vector<N>): Vector<N> {
        let res = Array(this.size).fill(0);
        for (let i = 0; i < this.size; i++) {
            res[i] += this.vec[i] - vector.vec[i];
        }
        this.vec = res as Vec<N>;
        this.length = this.calculateLength();
        return this;
    }

    public set(vec: Vec<N>): Vector<N> {
        this.vec = vec;
        this.length = this.calculateLength();
        return this;
    }

    public scale(factor: number): Vector<N> {
        for (let i = 0; i < this.length; i++) {
            this.vec[i] = this.vec[i] * factor;
        }
        return this;
    }
    

    public print(): void {
        console.log(this.vec);
    }

    public dropIndex(index: number): Vector<N> {
        if (index < 0 || index > this.length) throw new Error("ERROR: Index is out of bounce in the range of this vector.")
        return new Vector(this.length - 1 as N).set(this.vec.filter((_, i) => i !== index) as Vec<N>)
    }
    public dropAllButIndex(index: number): Vector<N> {
        if (index < 0 || index > this.length) throw new Error("ERROR: Index is out of bounce in the range of this vector.")
        return new Vector(this.length - 1 as N).set(this.vec.filter((_, i) => i === index) as Vec<N>)
    }

}



