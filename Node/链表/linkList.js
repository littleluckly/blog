class Node {
  constructor(element, next) {
    this.element = element;
    this.next = next;
  }
}

class LinkList {
  constructor() {
    this.head = null;
    this.size = 0;
  }
  // 添加节点
  add(index, element) {
    // 方法重载，当只传一个参数，表示往链表最后一个节点添加，即index不传，只传element,
    if (arguments.length === 1) {
      element = index;
      index = this.size;
    }
    // 处理边界条件
    if (index < 0 || index > this.size) {
      throw new Error("链表索引错误");
    }
    if (index === 0) {
      let head = this.head;
      this.head = new Node(element, head);
    } else {
      // a->b->d
      // 如要在b,d之间添加一个c节点
      // 则应该先找到index的前一个节点b
      // 将节点b的next指向新的节点c
      // 节点c的下一个节点则指向节点b原来的next
      const prevNode = this.getNode(index - 1);
      prevNode.next = new Node(element, prevNode.next);
    }
    this.size++;
  }
  getNode(index) {
    let current = this.head;
    // 从头开始遍历查找
    for (let i = 0; i < index; i++) {
      current = current.next;
    }
    return current;
  }
  remove(index) {
    let oldNode = null;
    if (index === 0) {
      oldNode = this.head;
      this.head = oldNode && oldNode.next;
    } else {
      const prevNode = this.getNode(index - 1);
      oldNode = prevNode.next;
      prevNode.next = oldNode.next;
    }
    this.size--;
    return oldNode && oldNode.element;
  }
}

// const ll = new LinkList();
// ll.add(0, 200);
// ll.add(0, 100);
// ll.add(2, 300);
// console.log(ll.getNode(1));
// console.log(ll.getNode(2));
// ll.remove(1);
// console.log(ll);

module.exports = LinkList;
