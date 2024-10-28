interface IEffect {
    fn: (state?: IEngineState) => void,
    stateDependencies: (keyof IEngineState)[] 
}

