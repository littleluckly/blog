function observe(obj) {
  Object.keys(obj).forEach((key) => reactive(obj, key, obj[key]));
}
function reactive(obj, key, val) {
  // 闭包，存储val，避免get,set自身造成死循环
  val = obj[key];
  Object.defineProperty(obj, key, {
    get: function () {
      console.log("get");
      return val; // 此处不能写成obj[key]，否则会造成死循环
    },
    set: function (newVal) {
      val = newVal; // 此处不能写成obj[key]=newVal，否则会造成死循环
      console.log("set");
    },
  });
}
const o1 = { name: "hello", age: 12 };
observe(o1);
o1.name = "hello world";
console.log(o1.name);
