interface IEffect<T extends keyof IEngineState> {
    fn: (state?: IEngineState) => void,
    stateDependencies: T[];
    //specificKey: ContainsButtonPressed<typeof T>
}

type ContainsButtonPressed<T extends (keyof IEngineState)[]> = T extends (infer U)[] ? ("buttonPressed") extends U ? string : never : never;
