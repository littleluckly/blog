## 创建应用

### create-react-app

官方脚手架快速创建应用，可以先全局安装脚手架 `npm i create-react-app -g`，再用命令 `create-react-app 项目名称`创建项目。

也可以使用命令 `npx create-react-app 项目名称`创建项目

> npx和npm的区别：
>
> npx是npm的一个自带命令，和npm类似，执行npx xxx的时候，npx先看xxx在$PATH里有没有，如果没有，找当前目录的node_modules里有没有，如果还是没有，就安装局部安装这个xxx 来执行。
>
> npx可用来解决全局命令行工具只能有一个的问题



### class类编写组件

class写法实现一个简单的TodoList

注意事项：

- this的绑定
- class样式类名的关键字改为className
- label标签的for属性改为htmlFor
- 编译字符串标签, 使用关键字 dangerouslySetInnerHTML={{ __html: 'xxxxx' }}

```react
import React, { Component, Fragment } from "react";

export default class App extends Component {
  constructor() {
    super();
    this.state = {
      inputValue: "",
      list: ["泰式按摩", "精油推背"],
    };
  }
  inputChange(e) {
    this.setState({
      inputValue: e.target.value,
    });
  }
  addService() {
    const { list, inputValue } = this.state;
    if (!inputValue) return;
    this.setState({
      list: list.concat(inputValue),
      inputValue: "",
    });
  }
  deleteListItem(idx) {
    const { list } = this.state;
    list.splice(idx, 1);
    // 注意不能直接使用this.state.list.splice(idx,1), this.setState({list})
    // 会造成性能问题
    this.setState({
      list,
    });
  }
  render() {
    return (
      <Fragment>
        <div>
          <input
            value={this.state.inputValue}
            onChange={this.inputChange.bind(this)}
          />{" "}
          <button onClick={this.addService.bind(this)}>增加服务</button>
        </div>
        <ul>
          {this.state.list.map((item) => {
            return <li onClick={this.deleteListItem.bind(this,idx)} key={item}>{item}</li>;
          })}
        </ul>
      </Fragment>
    );
  }
}

```

#### 组件拆分

将li的逻辑拆分成子组件 `ListItem`

```react
import React, { Component } from "react";

class ListItem extends Component {
  constructor(props) {
    super(props);
    this.handleClick = this.handleClick.bind(this);
  }
  handleClick() {
    this.props.deleteListItem(this.props.index);
  }
  render() {
    return <li onClick={this.handleClick}>{this.props.content}</li>;
  }
}

export default ListItem;
```

父组件引用子组件

```react
import React, { Component, Fragment } from "react";
import ListItem from "./ListItem";
export default class App extends Component {
  constructor() {
    super();
    this.state = {
      inputValue: "",
      list: ["泰式按摩", "精油推背"],
    };
  }
  inputChange(e) {
    this.setState({
      inputValue: e.target.value,
    });
  }
  addList() {
    const { list, inputValue } = this.state;
    if (!inputValue) return;
    this.setState({
      list: list.concat(inputValue),
      inputValue: "",
    });
  }
  deleteListItem(idx) {
    const { list } = this.state;
    list.splice(idx, 1);
    // 注意不能直接使用this.state.list.splice(idx,1), this.setState({list})
    // 会造成性能问题
    this.setState({
      list,
    });
  }
  render() {
    return (
      <Fragment>
        <div>
          <input
            value={this.state.inputValue}
            onChange={this.inputChange.bind(this)}
          />{" "}
          <button onClick={this.addList.bind(this)}>增加服务</button>
        </div>
        <ul>
          {this.state.list.map((item, idx) => {
            return (
              <ListItem
                key={idx}
                content={item}
                idx={idx}
                deleteListItem={this.deleteListItem.bind(this, idx)}
              />
            );
          })}
        </ul>
      </Fragment>
    );
  }
}

```



### vscode的react插件

##### 快捷键插件simple react snippets

快捷键语法：

- `imrc`  快速生成 `import React, { Component, Fragment } from "react";`

- `cc`  快速生成如下模板

  ![image-20211025213836959](https://i.loli.net/2021/10/25/tJH7hOuU6Z2wMqY.png)

