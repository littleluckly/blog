const promiseAll = (ps) => {
  return new Promise((resolve, reject) => {
    let length = ps.length;
    const res = Array.from({ length });
    for (let i = 0; i < ps.length; i++) {
      Promise.resolve(ps[i]).then(
        (val) => {
          res[i] = val;
          length--;
          if (length === 0) {
            return resolve(res);
          }
        },
        (err) => reject(err)
      );
    }
  });
};
// test
let p1 = new Promise(function (resolve, reject) {
  setTimeout(function () {
    resolve(1);
  }, 1000);
});
let p2 = new Promise(function (resolve, reject) {
  setTimeout(function () {
    resolve(2);
  }, 2000);
});
let p3 = new Promise(function (resolve, reject) {
  setTimeout(function () {
    resolve(3);
  }, 3000);
});
promiseAll([p3, p1, p2]).then((res) => {
  console.log(res); // [3, 1, 2]
});
