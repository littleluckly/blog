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
  - 用箭头函数的方式声明的方法，不需要额外绑定this
  - 构造函数constructor也可以省略
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
  // 推荐使用箭头函数，不需要额外再绑定this
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



#### 箭头函数改写组件的方法

```react

// 省略其他xxx
  inputChange = () => {
    const inputValue = this.inputRef.value;
    this.setState({
      inputValue: inputValue,
    });
  };
// 省略其他xxx
          <input
            value={inputValue}
            onChange={this.inputChange}
            ref={(ref) => (this.inputRef = ref)}
          />
```



#### 组件拆分

将li的逻辑拆分成子组件 `ListItem`，通过props获取父组件传递的属性和方法

```react
import React, { Component } from "react";

class ListItem extends Component {
  constructor(props) {
    super(props);
    
  // 实例方法推荐使用箭头函数，不需要额外再绑定this
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

父组件引用子组件，并将属性传递给子组件

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
  // 省略xxx...
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



#### props校验

- 引入PropTypes，使用快捷键 `impt`，生成 `import PropTypes from "prop-types";`

- 定义props类型、是否必填、默认值

  ```react
  import PropTypes from "prop-types";
  
  class ListItem extends Component {
    static propTypes = {
      idx: PropTypes.number.isRequired,
      content: PropTypes.string,
      deleteListItem: PropTypes.func,
    };
  
  	// 也可以设置默认值
    // static defaultProps = {
    //  content: "哈哈哈",
    // };
    // 省略xxx...
  }
  ```



#### refs

上文TodoList获取输入框的值是通过e.target.value实现的，react提供了ref获取真实的dom，

ref有三种写法

- 字符串形式，React 16.3版本之后，refs被弃用了，已被弃用，不推荐

  ```react
  <input ref='inputRef' />
  // 同过this.refs.inputRef获取
  ```

  

- 回调形式

  ```react
  <input ref={(ref) => (this.inputRef = ref)} />
  // 将inputRef挂到当前组件实例上
  ```

  这种书写方式在dom更新的时候会被执行两次

  如果把回调函数绑定到class上可以避免这种情况

- React.createRef

  ```react
  
    // React.createRef生成一个容器，该容器存放ref标识的节点
    inputRef2 = React.createRef();
  // 省略其他代码xxxx
  // 通过this.inputRef2.current.value获取当前元素的值
            <input
              value={inputValue}
              onChange={this.inputChange}
              ref={this.inputRef2}
            />
  ```

  

### vscode的react插件

##### 快捷键插件ES7 React/Redux/GraphQL/React-Native snippets

快捷键语法：

| `imr→`      | `import React from 'react'`                                  |
| ----------- | ------------------------------------------------------------ |
| `imrd→`     | `import ReactDOM from 'react-dom'`                           |
| `imrc→`     | `import React, { Component } from 'react'`                   |
| `imrcp→`    | `import React, { Component } from 'react' & import PropTypes from 'prop-types'` |
| `imrpc→`    | `import React, { PureComponent } from 'react'`               |
| `imrpcp→`   | `import React, { PureComponent } from 'react' & import PropTypes from 'prop-types'` |
| `imrm→`     | `import React, { memo } from 'react'`                        |
| `imrmp→`    | `import React, { memo } from 'react' & import PropTypes from 'prop-types'` |
| `impt→`     | `import PropTypes from 'prop-types'`                         |
| `imrr→`     | `import { BrowserRouter as Router, Route, NavLink} from 'react-router-dom'` |
| `imbr→`     | `import { BrowserRouter as Router} from 'react-router-dom'`  |
| `imbrc→`    | `import { Route, Switch, NavLink, Link } from react-router-dom'` |
| `imbrr→`    | `import { Route } from 'react-router-dom'`                   |
| `imbrs→`    | `import { Switch } from 'react-router-dom'`                  |
| `imbrl→`    | `import { Link } from 'react-router-dom'`                    |
| `imbrnl→`   | `import { NavLink } from 'react-router-dom'`                 |
| `imrs→`     | `import React, { useState } from 'react'`                    |
| `imrse→`    | `import React, { useState, useEffect } from 'react'`         |
| `redux→`    | `import { connect } from 'react-redux'`                      |
| `rconst→`   | `constructor(props) with this.state`                         |
| `rconc→`    | `constructor(props, context) with this.state`                |
| `est→`      | `this.state = { }`                                           |
| `cwm→`      | `componentWillMount = () => { }` DEPRECATED!!!               |
| `cdm→`      | `componentDidMount = () => { }`                              |
| `cwr→`      | `componentWillReceiveProps = (nextProps) => { }` DEPRECATED!!! |
| `scu→`      | `shouldComponentUpdate = (nextProps, nextState) => { }`      |
| `cwup→`     | `componentWillUpdate = (nextProps, nextState) => { }` DEPRECATED!!! |
| `cdup→`     | `componentDidUpdate = (prevProps, prevState) => { }`         |
| `cwun→`     | `componentWillUnmount = () => { }`                           |
| `gdsfp→`    | `static getDerivedStateFromProps(nextProps, prevState) { }`  |
| `gsbu→`     | `getSnapshotBeforeUpdate = (prevProps, prevState) => { }`    |
| `ren→`      | `render() { return( ) }`                                     |
| `sst→`      | `this.setState({ })`                                         |
| `ssf→`      | `this.setState((state, props) => return { })`                |
| `props→`    | `this.props.propName`                                        |
| `state→`    | `this.state.stateName`                                       |
| `rcontext→` | `const ${1:contextName} = React.createContext()`             |
| `cref→`     | `this.${1:refName}Ref = React.createRef()`                   |
| `fref→`     | `const ref = React.createRef()`                              |
| `bnd→`      | `this.methodName = this.methodName.bind(this)`               |



### 声明周期

#### 旧的声明周期

react声明周期分为四个大的过程，不同的过程可能拆分成不同的阶段

初始化initialization、挂载mounting、更新updation、卸载Unmounting

![image-20211030085138404](https://i.loli.net/2021/10/30/amstfqkvRCbVzB9.png)

- componentWillReceiveProps 只有第二次更新的时候才会触发，初始化渲染不会触发
- shouldComponentUpdate  返回布尔值，确定是否继续渲染，通用用于性能优化，也是只有第二次更新的时候才会触发，初始化渲染不会触发



#### 新的声明周期

React16.3版本之后新的声明周期废弃了三个带will的生命周期： `componentWillMount`、`componentWillReceiveProps`、`componentWillUpdate`。其实也不是废弃，直接使用这个三个生命周期会告警，可以添加前缀 `UNSAFE_`

提供了2个新的声明周期：

- getDerivedStateFromProps 组件的静态方法，从props获取一个派生对象，props的值会覆盖state里的值，状态值state任何时候都取决于props， 使用场景低

  ```react
  static getDerivedStateFromProps(props, state) {
    console.log(props, state);
    return props;
  }
  ```

  

- getSnapshotBeforeUpdate 获取组件更新前的快照, 必须返回一个值或者null，返回的值会被componentDidUpdate接受

![image-20211027074907214](https://i.loli.net/2021/10/27/cRl7HbrM59KQIyG.png)





#### 性能优化

上文的TodoList存在一个潜在的性能问题：输入框发生变化的时候，子组件也重新渲染了，打开chrome的react调试工具，渲染高亮配置，更改输入框内容可以发现，子组件也高亮了，说明子组件也被渲染了！

![image-20211027075016952](https://i.loli.net/2021/10/27/PWiRpI7HZXJS2GN.png)

优化手段:shouldComponentUpdate

```react
  shouldComponentUpdate(nextProps) {
    // 返回true才渲染，即content内容发生变化的时候才渲染 
    return nextProps.content !== this.props.content;
  }
```

经过测试发现如果使用CSSTransition组件包裹，则shouldComponentUpdate无论返回true还是false，都会被渲染

### react动画

官方库：react-transition-group