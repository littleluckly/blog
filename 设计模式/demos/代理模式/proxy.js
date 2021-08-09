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
      const contract = new Contract("解除代言合同");
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
      console.log("发电、针灸、选妃");
      // 假设吴亦凡有0.2的几率会去工作
      if (Math.random() < 0.2) {
        console.log("不玩了，开始工作");
        fn();
        return;
      }
    }
  },
};

customer.stopContract(proxyer);
