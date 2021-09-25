const LinkList = require("./linkList");
// 队列两个方法：往后追加， 从头删除
class Queue {
  constructor() {
    this.ll = new LinkList();
  }
  push(element) {
    this.ll.add(element);
  }
  shift() {
    return this.ll.remove(0);
  }
}
module.exports = Queue;
