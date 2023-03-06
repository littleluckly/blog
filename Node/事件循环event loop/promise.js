// 按照promise/A+规范实现

// 从一个简单的使用示例拆解需求
// const p1 = new Promise((resolve, reject) => {
//   console.log("000");
//   reject("222");
//   resolve("111");
// });
// p1.then(
//   (data) => {
//     console.log(data);
//   },
//   (reason) => {
//     console.log(reason);
//   }
// );

// v0.1版本
// Promise接收一个executor，默认会执行，有两个参数resolve、reject 用来改变状态
// promise由三种状态：pending、fulfilled、rejected
// 默认为pending状态，
// resolve方法将状态改为：pending => fulfilled
// reject方法将状态改为：pending => rejected
// 状态一经改变，就不能再次改变
// 提供then方法用来链式操作，处理成功和错误
// 如果抛出错误,如使用throw，也当做rejected
const STATUS = {
  PENDING: "PENDING",
  FULFILLED: "FULFILLED",
  REJECTED: "REJECTED",
};
// class MyPromise {
//   constructor(executor) {
//     this.state = STATUS.PENDING;
//     this.value = undefined;
//     this.reason = undefined;
//     const resolve = (val) => {
//       if (this.state === STATUS.PENDING) {
//         this.state = STATUS.FULFILLED;
//         this.value = val;
//       }
//     };
//     const reject = (reason) => {
//       if (this.state === STATUS.PENDING) {
//         this.state = STATUS.REJECTED;
//         this.reason = reason;
//       }
//     };

//     try {
//       executor(resolve, reject);
//     } catch (err) {
//       reject(err);
//     }
//   }
//   then(onfulfilled, onRejected) {
//     if (this.state === STATUS.FULFILLED) {
//       onfulfilled(this.value);
//     }
//     if (this.state === STATUS.REJECTED) {
//       onRejected(this.reason);
//     }
//   }
// }

// const p1 = new MyPromise((resolve, reject) => {
//   console.log("promise run");
//   // throw new Error("error");
//   reject("222");
//   resolve("111");
// });
// p1.then(
//   (data) => {
//     console.log("resolve---", data);
//   },
//   (reason) => {
//     console.log("reject---", reason);
//   }
// );

// v0.2版本
// 上文提供的版本中then方法执行的时候，可能状态还没有改变，没有解决异步问题，仍然是一个同步模式
// 引入发布订阅模式解决异步
// class MyPromise {
//   constructor(executor) {
//     this.state = STATUS.PENDING;
//     this.value = undefined;
//     this.reason = undefined;
//     // 发布订阅模式，处理异步问题
//     this.resolvedCallbacks = [];
//     this.rejectedCallbacks = [];
//     const resolve = (val) => {
//       if (this.state === STATUS.PENDING) {
//         this.state = STATUS.FULFILLED;
//         this.value = val;
//         this.resolvedCallbacks.forEach((fn) => fn());
//       }
//     };
//     const reject = (reason) => {
//       if (this.state === STATUS.PENDING) {
//         this.state = STATUS.REJECTED;
//         this.reason = reason;
//         this.rejectedCallbacks.forEach((fn) => fn());
//       }
//     };

//     try {
//       executor(resolve, reject);
//     } catch (err) {
//       reject(err);
//     }
//   }
//   then(onfulfilled, onRejected) {
//     // 同步
//     if (this.state === STATUS.FULFILLED) {
//       onfulfilled(this.value);
//     }
//     if (this.state === STATUS.REJECTED) {
//       onRejected(this.reason);
//     }
//     // 处理异步
//     if (this.state === STATUS.PENDING) {
//       this.resolvedCallbacks.push(() => {
//         onfulfilled(this.value);
//       });
//       this.rejectedCallbacks.push(() => {
//         onRejected(this.reason);
//       });
//     }
//   }
// }
// const p1 = new MyPromise((resolve, reject) => {
//   console.log("promise run");
//   setTimeout(() => {
//     resolve("123");
//   }, 1000);
// });
// p1.then(
//   (data) => {
//     console.log("resolve---", data);
//   },
//   (reason) => {
//     console.log("reject---", reason);
//   }
// );

// v0.3版本
// 实现promise实例可以链式调用.then方法，解决链式调用问题
// 1.then方法中的（成功/失败）如果返回普通数据类型，不管成功还是失败，将其包装一层promise，提供给下一个then的成功方法中
// 2.如果执行then方法出错，将就结果传递给下一then的失败
// 3.如果返回promise，则将结果传递给下一个then的成功/失败

function resolvePromise(x, promise2, resolve, reject) {
  // 规范2.3.1
  if (promise2 === x) {
    return reject(new TypeError("出错"));
  }
  // 2.3.3
  if ((typeof x === "object" && x !== null) || typeof x === "function") {
    let called;
    try {
      // 判断x是否promise对象
      let then = x.then;
      if (typeof then === "function") {
        then.call(
          x,
          function (y) {
            if (called) return;
            called = true;
            // 也有可能仍然是一个promise，所以需要递归调用，直到y是一个普通类型的值
            // resolve(y);
            resolvePromise(y, promise2, resolve, reject);
          },
          function (r) {
            if (called) return;
            called = true;
            reject(r);
          }
        );
      } else {
        if (called) return;
        called = true;
        resolve(x);
      }
    } catch (e) {
      if (called) return;
      called = true;
      reject(e);
    }
  } else {
    return resolve(x);
  }
}
class MyPromise {
  constructor(executor) {
    this.state = STATUS.PENDING;
    this.value = undefined;
    this.reason = undefined;
    // 发布订阅模式，处理异步问题
    this.resolvedCallbacks = [];
    this.rejectedCallbacks = [];
    const resolve = (val) => {
      if (this.state === STATUS.PENDING) {
        this.state = STATUS.FULFILLED;
        this.value = val;
        this.resolvedCallbacks.forEach((fn) => fn());
      }
    };
    const reject = (reason) => {
      if (this.state === STATUS.PENDING) {
        this.state = STATUS.REJECTED;
        this.reason = reason;
        this.rejectedCallbacks.forEach((fn) => fn());
      }
    };

    try {
      executor(resolve, reject);
    } catch (err) {
      reject(err);
    }
  }
  then(onfulfilled, onRejected) {
    // 规范2.2.1
    // onFulfilled 和 onRejected 都是可选参数。
    // 如果 onFulfilled 不是函数，其必须被忽略
    // 如果 onRejected 不是函数，其必须被忽略
    onfulfilled = typeof onfulfilled === "function" ? onfulfilled : (x) => x;
    onRejected =
      typeof onRejected === "function"
        ? onRejected
        : (err) => {
            // 此处不能return, 否则会被下一个then的onfulfilled捕获
            throw err;
          };
    const promise2 = new MyPromise((resolve, reject) => {
      // 同步
      if (this.state === STATUS.FULFILLED) {
        try {
          let x = onfulfilled(this.value);
          // resolve(x);
          // promise/A+规范2.3阐述了如何解决返回promise
          resolvePromise(x, promise2, resolve, reject);
        } catch (e) {
          reject(e);
        }
      }
      if (this.state === STATUS.REJECTED) {
        try {
          let x = onRejected(this.reason);
          resolvePromise(x, promise2, resolve, reject);
          // resolve(x);
        } catch (e) {
          reject(e);
        }
      }
      // 处理异步
      if (this.state === STATUS.PENDING) {
        this.resolvedCallbacks.push(() => {
          try {
            let x = onfulfilled(this.value);
            // resolve(x);
            resolvePromise(x, promise2, resolve, reject);
          } catch (e) {
            reject(e);
          }
        });
        this.rejectedCallbacks.push(() => {
          try {
            let x = onRejected(this.reason);
            // resolve(x);
            resolvePromise(x, promise2, resolve, reject);
          } catch (e) {
            reject(e);
          }
        });
      }
    });
    return promise2;
  }
}
const p1 = new MyPromise((resolve, reject) => {
  console.log("promise run");
  setTimeout(() => {
    reject("123");
  }, 1000);
});
p1.then(
  (data) => {
    console.log("resolve---", data);
  },
  (reason) => {
    console.log(reason);
  }
)
  .then(
    (data) => {
      console.log("then2", data);
    },
    (err) => {
      console.log("err2", err);
    }
  )
  .then((data) => {
    console.log("then3", data);
  });
