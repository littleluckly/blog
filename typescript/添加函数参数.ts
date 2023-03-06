type Fn = (a: number, b: string) => number
type AppendArgument<F, A> = F extends (...args: infer Args) => infer ReturnT ? (x: A, ...args: Args) => ReturnT : never
type FinalFn = AppendArgument<Fn, boolean>

const ff: FinalFn = (x: boolean, a: number, b: string) => a
// (x: boolean, a: number, b: string) => number