### requirements
- 扫描服务资产指纹识别
- 
- 如何使用？
- 


yum install ImageMagick libreoffice 
yum install openoffice.org-pyuno*
wget http://pkgs.repoforge.org/unoconv/unoconv-0.4-1.el5.rf.noarch.rpm


在用unoconv做文档转换时，发现中文转换乱码，网上找解决办法大多是：将 windows 下的字体全部拷贝到Linux字体库中并使之生效。
首先，在/usr/share/fonts/下新建文件夹 win 并设置权限，将 windows 下的 window－fonts 下字体全部拷贝到其中。
然后，
cd /usr/share/fonts/win
sudo mkfontscale
sudo mkfontdir            //这两条命令是生成字体的索引信息
sudo fc-cache -fv        //更新字体缓存
reboot

重启电脑后，再次转换就好了。

但是，当我们执行 mkfontscale 的时候发现，居然提示没有这个命令，
所以，
如果提示 mkfontscale: command not found，需安装   yum install mkfontscale 
如果提示 fc-cache: command not found，需安装  yum install fontconfig

这也是Linux系统安装中文字体的一种方式
