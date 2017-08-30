# chopper

this is my shell utils collection.
tree -L 3 -P *.**
git push origin “本地分支名称:远程分支名称”将本地分支推送至远程仓库，
git push origin hotfix（通常的写法）相当于

git push origin hotfix:hotfix

git push origin hotfix:newfeature

git remote add “主机名称” “远程仓库地址”添加远程主机，即给远程主机起个别名，方便使用

git remote 可以查看已添加的远程主机

git remote show “主机名称”可以查看远程主机的信息

git fetch  “远程主机”

git fetch “远程主机” “分支名称”
我们要注意的是，利用git fetch 获取的更新会保存在本地仓库中，但是并没有体现到我们的工作目录中，需要我们再次利用git merge来将对应的分支合并（融合）到特定分支。如下

 

git pull origin 某个分支， 上操作相当于下面两步

 

git fetch

 

git merge origin/某个分支





