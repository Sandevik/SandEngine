type Dimension = 4 | 3 | 2;

type MatrixVectorConstruct<S, N> = S extends 4 ? [
                        Vector<N>, 
                        Vector<N>, 
                        Vector<N>, 
                        Vector<N>
                    ] 
                   : S extends 3 ? [
                        Vector<N>, 
                        Vector<N>, 
                        Vector<N>
                    ] 
                   : [
                        Vector<N>, 
                        Vector<N>
                    ]

type MatrixArrayConstruct<S, N> =
    S extends 4 ?
    [[number, number, number, number],
    [number, number, number, number],
    [number, number, number, number],
    [number, number, number, number]]
    : S extends 3 ?
    [[number, number, number],
     [number, number, number],
     [number, number, number]]
    : [[number, number],
       [number, number]]



interface IMatrix<S, N> {
    mat: MatrixVectorConstruct<S, N>
    transform(withMatrix: Matrix<S, N>): Matrix<S, N>
    det(): number;
}