// 函数防抖：用于控制函数触发时机
// 比如一个函数持续不断的触发，我希望该函数仅在特定时间范围内执行最后一次
// 常见的如件监听输入框的change事件，只用当用户在300ms内没有输入时，采取执行一次函数

function debounce(fn, wait) {
  // 利用闭包特性保存定时器timer
  let timer = null;
  return function (...args) {
    // 遇到定时器，说明又触发了fn函数，清理定时器，防止触发
    if (timer) {
      clearTimeout(timer);
    }
    // 等待wait后，再执行fn
    timer = setTimeout(() => {
      fn.apply(this, args);
    }, wait);
  };
}

// 测试
let counter = 0;
const f1 = debounce(() => {
  console.log(counter);
}, 300);
// 测试：模拟持续触发函数
const timer = setInterval(() => {
  if (counter++ > 300) {
    clearInterval(timer);
  }
  f1();
}, 1);
