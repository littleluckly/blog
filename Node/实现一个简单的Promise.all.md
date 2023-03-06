目标：在Promise的基础上实现一个Promise.all方法。

`Promise.all`需求拆解

1. 该方法返回一个新的`Promise`
2. 参数是一个数组，数组中的每一项既可能是一个Promise实例，也有可能只是一个常量
3. 遍历数组，等待每一项执行完成
   1. 将执行结果用一个变量保存起来
   2. 如果有其中一项失败，则直接reject当前失败的一项错误信息；
   3. 全部执行成功，则按传参顺序resolve所有结果



先完成第1步：
返回一个新的`Promise`
```js
// 接受promise数组，返回新的Promise
Promise.all = function () {
  return new Promise((resolve, reject) => {});
};
```

第2步:
接受数组参数，处理数组项是常量的情况
```js
Promise.all = function (promises) {
  return new Promise((resolve, reject) => {
    const len = promises.length;
    promises.forEach((val, idx) => {
      // 不管是一个常量，还是promise，全部用Promise.resolve包装一次，
      Promise.resolve(val)
        .then((res) => {
          // TODO：保存结果，判断是否全部执行完成
        })
    });
  });
};
```

第3步：

遍历数组，等待每一项执行完成

1. 将执行结果用一个变量保存起来
2. 如果有其中一项失败，则直接reject当前失败的一项错误信息；
3. 全部执行成功，则按传参顺序resolve所有结果

```js
Promise.all = function (promises) {
  // 计数器，判断是否执行完了所有的promise
  let count = 0;
  const resMap = {};
  return new Promise((resolve, reject) => {
    const len = promises.length;
    promises.forEach((val, idx) => {
      Promise.resolve(val)
        .then((res) => {
        	// 将结果保存在一个对象里，用key记录入参顺序idx，
          resMap[idx] = res;
          ++count;
          
          if (count === len) {
            // 按入参顺序返回结果
            resolve(
              Object.keys(resMap).reduce((resList, key) => {
                resList[key] = resMap[key];
                return resList;
              }, Array.from({ length: len }))
            );
          }
        })
        .catch((err) => {
          reject(err);
        });
    });
  });
};
```

以上就是一个promise.all的实现过程，下面编写测试代码

```js

const p1 = new Promise((resolve) => {
  resolve(1);
});
const p2 = new Promise((resolve) => {
  setTimeout(() => {
    resolve(2);
  }, 2000);
});

const p3 = function () {
  return 3;
};

(async function () {
  const res = await Promise.all([p1, p2, p3()]);
  console.log("res", res); // 2秒后输出结果:  [1, 2, 3]
})();
```

*思考题：如何实现一个Promise.race?*

实现思路：

只要传入的参数中的

定义一个flag=false变量，表示是否有完成，

只要任何一个完成/失败，flag改为true，然后resolve/reject。

```js
Promise.race = function (promises) {
  let flag = false;
  return new Promise((resolve, reject) => {
    const len = promises.length;
    promises.forEach((val, idx) => {
      Promise.resolve(val)
        .then((res) => {
          if (!flag) {
            flag = true;
            resolve(res);
          }
        })
        .catch((err) => {
          if (!flag) {
            flag = true;
            reject(err);
          }
        });
    });
  });
};

const p4 = new Promise((resolve, reject) => {
  reject(4);
});

(async function () {
  const res = await Promise.race([p4]);
  console.log("res", res);
})();
```

