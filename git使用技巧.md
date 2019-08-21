# git 使用技巧

#### 1. git 别名配置，提高效率

把经常使用的名称配置一个别名，可以有效提高工作效率，如 checkout 配置别名 ck, 配置成功后可使用 git ck 命令替代 git checkout

```
git config --global alias.ck checkout

git config --global alias.br branch

git config --global alias.st status

git config --global alias.cm commit

git config --global alias.pl pull

git config --global alias.ps push
```

---

#### 2. git 命令行工具在正常不显示中文，可以通过`git config --global core.quotepath off`解决
