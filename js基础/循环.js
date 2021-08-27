const arr = Array.from({ length: 5 }).map((v, idx) => idx);

for (let i = 0; i < arr.length; i++) {
  if (i == 2) {
    break;
    // return
    // break和return都能正确跳出循环
  }
  console.log(i);
}
arr.forEach((item, idx) => {
  if (idx === 2) {
    return;
  }
  console.log(idx);
});
