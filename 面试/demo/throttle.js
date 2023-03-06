function throttle(fn, wait) {
  let timer;
  return function () {
    const ctx = this;
    const args = [...arguments];
    if (!timer) {
      timer = setTimeout(() => {
        fn.apply(ctx, args);
        clearTimeout(timer);
        timer = null;
      }, wait);
    }
  };
}
