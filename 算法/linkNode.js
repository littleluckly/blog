class Node {
  next = null;
  constructor(element) {
    this.element = element;
  }
}

class LinkNode {
  head = new Node("head");
  insert(newElement, oldElement) {
    const newNode = new Node(newElement);
    const currNode = this.find(oldElement);
    newNode.next = currNode.next;
    currNode.next = newNode;
  }
  find(element) {
    let currNode = this.head;
    while (currNode.element !== element && currNode.next !== null) {
      currNode = currNode.next;
    }
    return currNode;
  }
  display() {
    let currNode = this.head;
    while (currNode.next !== null) {
      console.log(currNode.element);
      currNode = currNode.next;
    }
    console.log(currNode.element);
  }
  delete(element) {
    let currNode = this.head;
    let preNode = this.head;
    if (currNode.element === element) {
      this.head = currNode.next;
    } else {
      while (currNode.element !== element && currNode.next !== null) {
        preNode = currNode;
        currNode = currNode.next;
      }
      preNode.next = currNode.next;
    }
  }
}
const list = new LinkNode();
list.insert("1", "head");
list.insert("2", "1");
list.insert("3", "1");
list.insert("4");
// list.display();
list.delete("3");
list.display();
