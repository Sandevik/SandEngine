import Vector from "../../models/Math/Vector";

type Vec<T extends Dimension> = T extends 4 ? [number, number, number, number] : T extends 3 ? [number, number, number] : [number, number];

interface IVector<N extends Dimension> {
    vec: Vec<N>;
    size: N;
    length: number;
    cross(vector: Vector<N>): Vector<N> | number;
    dot(vector: Vector<N>): number;
    add(vector: Vector<N>): void;
    subtract(vector: Vector<N>): void;  
    scale(factor: number): Vector<N>;
}