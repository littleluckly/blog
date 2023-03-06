// 需求实现ConditionalPick类型，将符合某个类型的子属性挑出来
interface Example {
  a: string;
  b: string | number;
  c: () => void;
  d: {};
}

type ConditionalPick<T, C> = {
  [K in keyof T as T[K] extends C ? K : never]: T[K]
}
// 测试用例：
type StringKeysOnly = ConditionalPick<Example, string>;
