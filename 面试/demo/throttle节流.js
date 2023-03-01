// 函数节流：控制函数执行频率，如每隔某段时间执行一次函数
// 如监听浏览器尺寸变化时，不需要每次变化都执行监听函数，可以每隔16ms触发一次

function throttle(fn, interval) {
  // 加一个标志状态，能否执行
  let canRun = true;
  return function (...args) {
    if (!canRun) {
      return;
    }
    // 调用一次函数后，将状态改为false，中断函数再次调用，只能等我本次函数执行完毕后，才能继续执行
    canRun = false;
    setTimeout(() => {
      fn.apply(this, args);
      canRun = true;
    }, interval);
  };
}

// 测试
let counter = 0;
const f1 = throttle(() => {
  console.log(counter);
}, 17);
// 测试：模拟持续调用函数
const timer = setInterval(() => {
  if (counter++ > 300) {
    clearInterval(timer);
  }
  f1();
}, 1);
