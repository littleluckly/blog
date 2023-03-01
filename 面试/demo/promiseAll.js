Promise.all = function (promises) {
  let count = 0;
  const resMap = {};
  return new Promise((resolve, reject) => {
    const len = promises.length;
    promises.forEach((val, idx) => {
      Promise.resolve(val)
        .then((res) => {
          resMap[idx] = res;
          ++count;
          if (count === len) {
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
  console.log("res", res);
})();

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
