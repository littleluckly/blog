function objectCreate(obj) {
  function F() {}
  F.prototype = obj;
  const res = new F();
  return res;
}

// 验证
const obj = { val: 1 };
console.log(Object.create(obj).__proto__ === objectCreate(obj).__proto__);
