import { Vec } from "../../types/Math/Vec";
import Vector from "./Vector";





export default class Matrix<S extends Dimension, N extends Dimension> implements IMatrix<S, N> {
    mat: MatrixVectorConstruct<S, N>;
    size: S;
    constructor(vectors: MatrixVectorConstruct<S, N>) {
        
        this.size = vectors.length as S;
        this.mat = vectors;
    }

    transform(withMatrix: Matrix<S, N>): Matrix<S, N> {
        const newVecs: Vector<N>[] = []
        for (let i = 0; i < withMatrix.size; i++) {
            newVecs.push(this.multiplyWithVector(withMatrix.mat[i]))
        }
        return new Matrix(newVecs as MatrixVectorConstruct<S, N>);


    }

    public multiplyWithVector(vector: Vector<N>): Vector<N> {
        const vec: Vector<N> = new Vector(vector.size);
        const arr: number[] = []; 
        for (let i = 0; i < this.size; i++) {
            let currentSum: number = 0;
            for (let j = 0; j < this.size; j++) {
                const x = vector.vec[j];
                const a = this.mat[j].vec[i];
                currentSum += x*a;
            }       
            arr.push(currentSum);     
        }
        vec.set(arr as Vec<N>);
        return vec;
    }

    det(): number {
        return 1
    }

    public print(): void {
        let res = "";
        switch (this.size) {
            case 4:
                res = `${this.mat[0].vec[0]} ${this.mat[1].vec[0]} ${this.mat[2].vec[0]} ${this.mat[3].vec[0]}\n${this.mat[0].vec[1]} ${this.mat[1].vec[1]} ${this.mat[2].vec[1]} ${this.mat[3].vec[1]}\n${this.mat[0].vec[2]} ${this.mat[1].vec[2]} ${this.mat[2].vec[2]} ${this.mat[3].vec[2]}\n${this.mat[0].vec[3]} ${this.mat[1].vec[3]} ${this.mat[2].vec[3]} ${this.mat[3].vec[3]}`
                break;
            case 3:
                res = `${this.mat[0].vec[0]} ${this.mat[1].vec[0]} ${this.mat[2].vec[0]}\n${this.mat[0].vec[1]} ${this.mat[1].vec[1]} ${this.mat[2].vec[1]}\n${this.mat[0].vec[2]} ${this.mat[1].vec[2]} ${this.mat[2].vec[2]}`
                break;
            case 2:
                res = `${this.mat[0].vec[0]} ${this.mat[1].vec[0]}\n ${this.mat[2].vec[0]}${this.mat[0].vec[1]}`
        }



        console.log(res)
    }

}


