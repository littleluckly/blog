Promise.race = function (promises) {
  return new Promise((resolve, reject) => {
    promises.forEach((p) => {
      if (p && typeof p.then === "function") {
        p.then(resolve, reject);
      } else {
        resolve(p);
      }
    });
  });
};

const p1 = new Promise((resolve) => {
  resolve(11);
});

const p2 = new Promise((resolve) => {
  setTimeout(() => {
    resolve(22);
  });
});

Promise.race([p1, p2, 3]).then((data) => {
  console.log(data);
});
