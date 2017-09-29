#!/usr/bin/env bash
cat <<EOF
     _
  __| |_ __ __ _  __ _  ___  _ __
 / _` | '__/ _` |/ _` |/ _ \| '_ \
| (_| | | | (_| | (_| | (_) | | | |
 \__,_|_|  \__,_|\__, |\___/|_| |_|

EOF

installNodeByRepo(){
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
    cnpm install npm -g
    # 安装常见需要安装的工具
    cnpm install PM2 gulp mocha karma jsmine nightwatch jshint node-gyp webpack less babel express-generator -g
    cnpm install
}

installNodeBySource(){
    yum -y update
    yum -y groupinstall "Development Tools"
    cd /usr/src
    wget http://nodejs.org/dist/v0.10.18/node-v0.10.18.tar.gz
    tar zxf node-v0.10.18.tar.gz
    cd node-v0.10.18
    ./configure
    make
    make install
}

installJava(){
    echo "=======install java======="
    rpm -qa|grep jdk

}

installPython(){
    echo $0
}

installGo(){
    echo $0
    wget https://storage.googleapis.com/golang/go1.9.linux-amd64.tar.gz
    tar -C /usr/local -xzf go1.9.linux-amd64.tar.gz
    mkdir ~/go1.9
    local magic='
    export PATH=$PATH:/usr/local/go/bin
    export GOROOT=$HOME/go1.9
    export PATH=$PATH:$GOROOT/bin
    '
    ehco ${magic} ~.bashrc
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

installMysql(){
    echo "============install mysql=============="
    wget http://dev.mysql.com/get/mysql-community-release-el7-5.noarch.rpm | rpm -ivh
    yum install mysql-community-server
    systemctl enable mysqld
    systemctl daemon-reload
    systemctl start mysqld
    systemctl status mysqld
}

installRabbitMq(){
    echo "==========install rabbit mq========="
    echo "http://www.jianshu.com/p/ce725e41edab"
    rpm -Uvh http://download.fedoraproject.org/pub/epel/7/x86_64/e/epel-release-7-8.noarch.rpm
    yum install erlang -y
    sudo yum install socat -y
    rpm --import http://www.rabbitmq.com/rabbitmq-signing-key-public.asc
    rpm -Uvh http://www.rabbitmq.com/releases/rabbitmq-server/v3.6.6/rabbitmq-server-3.6.6-1.el7.noarch.rpm
    systemctl enable rabbitmq-server
    systemctl start rabbitmq-server
    systemctl status rabbitmq-server
    rabbitmqctl add_user owen owen
    rabbitmqctl set_permissions -p "/" admin ".*" ".*" ".*"
    rabbitmqctl set_user_tags admin administrator
    rabbitmq-plugins enable rabbitmq_management
    systemctl restart rabbitmq-server
    firewall-cmd --zone=public --add-port=5672/tcp --permanent
    firewall-cmd --zone=public --add-port=15672/tcp --permanent
    firewall-cmd --reload
    wget http://localhost:15672
}

installMongodb(){
    echo "=============install mongodb============"
    echo "http://www.jianshu.com/p/65c220653afd"
    sudo cat > /etc/yum.repos.d/mongodb-3.2.repos <<EOF
[mongodb-org-3.2]
name=MongoDB Repository
baseurl=https://repo.mongodb.org/yum/redhat/$releasever/mongodb-org/3.2/x86_64/
gpgcheck=1
enabled=1
gpgkey=https://www.mongodb.org/static/pgp/server-3.2.asc
EOF
    yum -y install mongodb-org mongodb-org-server
    systemctl enable mongod
    systemctl start mongod
    systemctl status mongod
    systemctl daemon-reload
}

installUtils(){
    echo $0
    yum install htop sshfs mc -y
    rpm -ivh http://pkgs.repoforge.org/axel/axel-2.4-1.el6.rf.x86_64.rpm
    yum install axel -y
    wget http://pkgs.repoforge.org/axel/axel-2.4-1.el6.rf.x86_64.rpm | rpm -ivh
}

installRust(){
    echo "=======install rust======="
    curl https://sh.rustup.rs -sSf | sh
    source ~/.bashrc
}

installPerl(){
    echo "==============start install perl ==================="
    cd ~
    tempdir=`mktemp -d ./tmpd.XXXXXX`
    cd ${tempdir}

    # get perl tarball
    wget http://www.cpan.org/src/5.0/perl-5.26.0.tar.gz
    tar -zxvf perl-5.26.0.tar.gz
    cd perl-5.26.0

    # compile perl
    ./Configure -des -Dprefix=/usr/local/perl
    make
    make test
    make install
    mv /usr/bin/perl /usr/bin/perl.bak

    ln -s /usr/local/perl/bin/perl /usr/bin/perl

    # valid install
    perl -v
    if [ $? -eq 0 ];then
        echo "install perl is success"
        rm -rf ${tempdir} 2>/dev/null
        return 0
    fi
    return 0
}

clearLog(){
    echo "======clear log======"
    declare -i PERCENT=0
    logFile=(
        /var/log/syslog
        /var/adm/sylog
        /var/log/wtmp
        /var/log/maillog
        /var/log/messages
        /var/log/openwebmail.log
        /var/log/maillog
        /var/log/secure
        /var/log/httpd/error_log
        /var/log/httpd/ssl_error_log
        /var/log/httpd/ssl_request_log
        /var/log/httpd/ssl_access_log
        ~/.bash_history
    )
    (
        for file in ${logFile[@]};
        do
            if [ -f ${file} ];then
            let PERCENT+=1
            echo "XXX"
            echo "clear the file ${file##*/} ..."
            echo "XXX"
            echo ${PERCENT}
            fi
         done
    ) | dialog --title "clearing" --gauge "clear the ${file}..." 6 100 0

}

makeAlias(){
    echo $0
    echo "alias filter='ls -alh | grep'" >> ~/.bashrc
    echo "alias process='ps -eaf | grep'" >> ~/.bashrc
    . ~/.bashrc
}

open80(){
    sudo firewall-cmd --zone=public --add-port=80/tcp --permanent
    sudo firewall-cmd --reload
    systemctl restart firewalld.service
}

configureRepo(){
     sudo yum install epel-release
     wget http://download.fedoraproject.org/pub/epel/6/i386/epel-release-6-8.noarch.rpm | rpm -ivh
     yum install epel-release -y
     yum install yum-axelget -y
     rpm --import https://www.elrepo.org/RPM-GPG-KEY-elrepo.org
     rpm -Uvh http://www.elrepo.org/elrepo-release-7.0-2.el7.elrepo.noarch.rpm

     cd /etc/yum.repos.d/
     sudo mv CentOS-Base.repo CentOS-Base.repo.bak
     wget -O CentOS-Base.repo http://mirrors.aliyun.com/repo/Centos-7.repo
     wget -P /etc/yum.repos.d/  http://mirrors.163.com/.help/CentOS7-Base-163.repo
     wget -P /etc/yum.repos.d/  http://mirrors.aliyun.com/repo/Centos-7.repo
     yum clean all
     yum makecach

     sed -i '/SELINUX/s/enforcing/disabled/' /etc/selinux/config
}

makeEnv(){
       mkdir ~/lab
       mkdir ~/workspace
}

initCentos7(){
     configureRepo
     makeAlias
     installUtils
}

ceshi(){
    perl -v
    echo $?
    if [ $? -eq 0 ];then
        echo "success"
    fi
}

cmdList=(
"makeEnv"
"makeAlias"
"configureRepo"
"installUtils"
"installNode"
"installJava"
"installPython"
"installGo"
"installNginx"
"installMysql"
"installRabbitMq"
"installMongodb"
"installPerl"
"installRust"
"open80"
"clearLog"
"ceshi"
)

select cmd in ${cmdList[@]};
do
    ${cmd}
    if [];then
    echo "you command is done and success!"
    fi
    exit 0
done
