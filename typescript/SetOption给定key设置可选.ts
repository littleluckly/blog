type Simplefly<T> = {
  [K in keyof T]: T[K]
}
// 设置可选
type SetOptional<T, K extends keyof T> = Simplefly<Partial<Pick<T, K>> & Pick<T, Exclude<keyof T, K>>>
type Foo = {
  a: number;
  b?: string;
  c: boolean;
}

// 测试用例
type SomeOptional = SetOptional<Foo, 'a' | 'c'>;
const a: SomeOptional = {}


// 设置必填
type SetRequired<T, K extends keyof T> = Simplefly<Pick<T, Exclude<keyof T, K>> & Required<Pick<T, K>>>
type Baz = {
  a?: string;
  b?: number;
  c?: boolean;
}
type BazRequired = SetRequired<Baz, 'c' | 'a'>
const baz1: BazRequired = {
  a: 'lkj',
  c: true
}
