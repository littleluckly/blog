## 架空故事

> 为更好的理解代理模式，我们先设定一个虚拟的场景：某年某月某爱好发电、喜好针灸、热衷选妃的明星因违法事件被解除了商业代言合同。这个解除过程就是一个很好的代理模式

经纪人在解除合同过程中充当了代理角色，合同解除过程：

```html
客户=>经纪人=>明星
```

用代码描述这个过程是这样的：

```js
const Contract = function (str) {
  return str;
};
const customer = {
  stopContract(proxy) {
    const contract = new Contract("解除代言合同");
    proxy.reciveContract(contract);
  },
};
const proxyer = {
  reciveContract(contract) {
    wuyifan.reciveContract(contract);
  },
};
const wuyifan = {
  reciveContract(contract) {
    console.log("😭收到合同:", contract);
  },
};

customer.stopContract(proxyer);
```

在这个例子中，看不出代理模式的优势，好像把一个简单的过程反而弄的更加复杂了，proxyer 只是简单的把事情进行了转发，没有起到太大的作用，下面来看一个更复杂的场景：

某明星因为工作繁忙，有时在电厂发电，有时在某个选妃现场，也有时在做针灸，总之就是客户不确定什么时候能找到四处奔波的该明星，但是其经纪人就具备随时找到该明星，客户不需要关注该明星什么时候有空，只需要把解除合同交给经纪人就行

```js
const Contract = function (str) {
  return str;
};
const customer = {
  stopContract(proxy) {
    const contract = new Contract("解除代言合同");
    proxy.reciveContract(contract);
  },
};
const proxyer = {
  reciveContract(contract) {
    wuyifan.work(function () {
      wuyifan.reciveContract(contract);
    });
  },
};
const wuyifan = {
  reciveContract(contract) {
    console.log("😭收到合同:", contract);
  },
  work(fn) {
    while (true) {
    	console.log('选妃、针灸、发电')
      // 假设该明星有0.2的几率会去工作
      if (Math.random() < 0.2) {
        console.log("不玩了，开始工作");
        fn();
        return;
      }
    }
  },
};

customer.stopContract(proxyer);
```

在这代理模式中可以明确看出代理模式的优势，客户不需要关注该明星什么时候在工作，什么时候在玩，只需简单给出一份解除合同就行，剩下的就有经纪人去处理。

回到代理模式的本身，代理模式是为一个对象提供一个代替品，用这个代替品去控制原对象的访问，生活中有很多这样的场景，如上文的例子，点外卖等。

代理模式的关键是，当客户不方便直接访问一个对象或者不满足直接访问条件的时候，提供一个代理对象，通过这个代理对象来访问原对象

## 保护代理/虚拟代理

时间往前回推几年，某明星正处于事业巅峰时期，粉丝无数，有很多客户纷纷想要找其代言，同样找到了经纪人，经纪人会根据客户品牌和明星形象是否符合，过滤掉不合适的客户，这种代理叫保护代理

在上文提到的`new Contract`如果是一件比较耗性能的过程，把这个过程挪到代理对象中去进行，当真正需要的时候才创建，这个种代理称之为虚拟代理

```js
// 虚拟代理
const proxyer = {
  reciveContract(contract) {
    wuyifan.work(function () {
      // 真正需要的时候创建contract
      const contract = new Contract("解除代言合同");
      wuyifan.reciveContract(contract);
    });
  },
};
```

模拟一个实际需求场景：在页面上创建一个加载loading，需要避免重复创建，后续创建只需要动态设置他的显示隐藏就行

先来实现第一版

```js
      const CreateLoading = function () {
        if (CreateLoading.instance) {
          return CreateLoading.instance;
        }
        const div = document.createElement("div");
        div.innerHTML = "正在加载中...";
        div.style.cssText = "display:none;";
        document.body.appendChild(div);
        return (CreateLoading.instance = div);
      };
      const loadingEle = new CreateLoading();
      loadingEle.style.cssText = "display:block;";
```

在这一版中，判断是否已经创建了loading和创建loading两个行为都在一个构造函数中，不符合单一职责原则。可以引入代理模式进行优化

- `ProxyCreateLoading`代理类判断是否已创建
- `CreateLoading`只负责创建loading

```js
      const CreateLoading = function () {
        const div = document.createElement("div");
        div.innerHTML = "正在加载中...";
        div.style.cssText = "display:none;";
        document.body.appendChild(div);
        return div;
      };

      const ProxyCreateLoading = (function () {
        let instance;
        return function () {
          if (!instance) {
            instance = new CreateLoading();
          }
          return instance;
        };
      })();
      const loadingEle = new ProxyCreateLoading();
      loadingEle.style.cssText = "display:block;";
      console.log(loadingEle === new ProxyCreateLoading()); // true
```



