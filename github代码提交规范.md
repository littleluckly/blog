## 格式

```js
type<(scope)>: subject
// 空行
body
// 空行
footer
```

```html
示例：
fix: 修复xxxbug
feat: 新增xxx功能
refactor(新建流程): 使用函数组合重构新建页面流程
```



- type（必需）
  - feat :新功能 
  - fix :修复bug  
  - docs : 文档改变
  - style : 代码格式改变
  - refactor :某个已有功能重构
  - perf :性能优化
  - test :增加测试/测试用例
  - revert: 撤销上一次的 commit 
  - chore: 改变构建流程、或者增加依赖库、工具等
  - Init：新建库
  - build :改变了build工具 如 grunt换成了 npm
- scope（）代码修改范围
- subject（必需）
- body (可选)

