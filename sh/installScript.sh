#!/usr/bin/env bash
# author    :   owen-carter
# usage     :   install app

appDirectoryName="app"
appPackageName=./${appDirectoryName}.tar.gz

# common
function parseApp(){
    printf "start parse app package ..."
    sed -n -e '1,/^exit 0$/!p' $0 > ${appPackageName} 2>/dev/null
}

# install node
function installNode(){
    echo "=======install node========"
    rpm -ivh http://mirrors.ustc.edu.cn/fedora/epel/6/x86_64/epel-release-6-8.noarch.rpm
    yum -y update
    yum -y groupinstall "Development Tools"
    yum install git -y
    curl -o- https://raw.githubusercontent.com/creationix/nvm/v0.33.2/install.sh | bash
    . ~/.bashrc
    nvm --version
    if [ $? -eq 0 ];then
    echo "install nvm is success"
    fi
    # 安装node7
    nvm install 7
    node -v
    if [ $? -eq 0 ];then
    echo "install node is success"
    fi
    # 永久设置npm源为淘宝源
    npm config set registry http://registry.npm.taobao.org
    npm install -g cnpm --registry=https://registry.npm.taobao.org
    # 更新npm
    npm install npm -g
    # 安装常见需要安装的工具
    npm install PM2 node-gyp express -g
}

InstallJRE()
{
	local filename=/etc/profile
	tmpnum=`sed -n -e '/JAVA_HOME/=' ${filename}`
	if [ -z "$tmpnum" ];then
		#sed -i "/JAVA_HOME/d" ${filename}

		echo "export JAVA_HOME=/opt/jre" >> ${filename}
		echo "export CLASS_PATH=\$JAVA_HOME/lib" >> ${filename}
		echo "export PATH=\$PATH:\$JAVA_HOME/bin" >> ${filename}
	fi

	source /etc/profile
}


installNginx(){
    echo "===============install nginx========="
    yum install gcc-c++  pcre pcre-devel  zlib zlib-devel  openssl openssl--devel  -y
    if [ `find -name nginx` ];then
    yum remove nginx
    fi
    yum install nginx -y

    if [ `whereis nginx` ];then
    echo "success"
    else
    echo "install fial!"
    fi
    systemctl enbale nginx
    systemctl daemon-reload
    systemctl start nginx
    systemctl status nginx
    wget "localhost"
}

# open 80 port
function open80(){
    printf "open the 80 port..."
    sudo firewall-cmd --zone=public --add-port=80/tcp --permanent
    sudo firewall-cmd --reload
    systemctl restart firewalld.service
}

# you need to implement the app install method procedure
function installApp(){
    local publishPath="/opt/${appDirectoryName}"
    tar jxvf ./${appPackageName}
    ls -alh ./${appPackageName}
    cp -R -v ${appDirectoryName} ${publishPath}
    cd ${appDirectoryName}
    # private procedure
    installNode
    installNginx
    open80
}

parseApp
installApp
exit 0