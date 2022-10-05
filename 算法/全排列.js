// 思路
// 递归找出所有组合（路径）
// 排除路径中重复的数字
// 递归终点：路径长度等于nums.length
const permute = (nums) => {
  const res = [];
  const backtrack = (path) => {
    if (path.length === nums.length) {
      res.push(path);
    }
    nums.forEach((n) => {
      if (path.includes(n)) {
        return;
      }
      backtrack(path.concat(n));
    });
  };
  backtrack([]);
  return res;
};
console.log(permute([1, 2, 3]));
