type ColorType = number[] | string | number

export default class Color {
    private r: number = 0;
    private g: number = 0;
    private b: number = 0;
    private a: number = 0;
    constructor(color: ColorType) {
        if (typeof color === "string") {
            // match regex
        } else if (typeof color === "number") {
            // constraint number value to be a u8
        } else {
            this.r = color[0]
            this.g = color[1]
            this.b = color[2]
            this.a = color[3]
        }
    }
}