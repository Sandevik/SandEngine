# 3D Engine
**This project includes a 3d engine written in TypeScript along with a custom made math library for linear algebra. All without any external packages or libraries**

**Why?**
The best way for me to learn about how things work is to make them from scratch, discovering problems, solving them and building intuition for how things work.

**What have I expected to learn?**
I expected to learn how pixel buffers are modified to create images. Along with a little linear algebra.

**What did I learn?**
- Loops are EXPENSIVE. When rendering, loops take a very long time to process 1920x1080px. (Not multithreaded or rendered by shaders.) 
- How to optimize the engine so that it runs faster and smoother. (How to re-render the screen, only if it is needed!)
- How game loops, states, and functions like "useEffect" in react works.
- How to build my own version of HTML, CSS on image buffers (Without HTML nor CSS) 
- Converting math on paper to code. (Algorithmic thinking deluxe)
- Why I need to look more into shaders for further optimizations.
- Building in a way that other programmers easily can use my library to create their own things without having to recreate everything from scratch, i.e clear and consize code.

## Engine
**Functions**
- Drawing: Draw pixels on the screen with cursors.

## Linear Algebra Math Library
**My own implementation on vectors and matricies from scratch**

### Vectors
**Functions**
- Additon
- Subtraction
- Dot products
- Cross products
- Normalization
- Scalars

### Matricies
**Functions**
- Transformations of same size matricies (Multiplication of matricies) (All dimensions)
- Vector multiplication of matricies (All dimensions)
- Determenant (All dimensions)
