const str = "ab";
const set = new Set([...str]);

console.log(set.size, set.values().next().value);
