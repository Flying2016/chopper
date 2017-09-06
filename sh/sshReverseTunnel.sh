#!/usr/bin/env bash
# author :  owen-carter
# usage  :  临时搭建反向穿透




function logger(){
    # log
    printf "[owen-carter]:"${1}
}


function beforeEach(){
    port=6666
    homeUserName="root"
    vpsIp="12.12.12.12"
    vpsUserName="root"
    vpsPort=${port}

    read -P "请输入整条链路使用的端口，默认6666" port
    if [[ -n port  ]];then
        port=6666
    else
        port=${port}
    fi
    read -P "请输入家中电脑的用户名" homeUserName
    read -P "请输入vps的IP地址" vpsIp
    read -P "请输入vps的用户名" vpsUserName
}

function home(){
    # init
    beforeEach

    # 内网机器代码
    # ssh -R ${vpsPort}:localhost:22” 选项定义了一个反向隧道
    # 它转发中继服务器 ${vpsPort} 端口的流量到内网服务器的 22 号端口。
    # 回车以后没有反应是正常的,隧道已经建立
    ssh -p 22 -qngfNTR ${vpsPort}:127.0.0.1:22 "${vpsUserName}"@"${vpsIp}"
}

function vps(){
    # init
    beforeEach

    # vps机器
    # 确认vps机器 127.0.0.1:${vpsPort} 绑定到了 sshd
    local result=""
    result=`netstat -nap | grep ${vpsPort} | wc -l`
    if [[ result = 1 ]];
    then
        logger "连接已经建立。。。"
        # 从SSH访问位于NAT网络里的linux机器
         ssh -p 6666 ${vpsUserName}@127.0.0.1
    else
        logger "连接建立失败。。。"
    fi
}

function office(){
    # init
    beforeEach

    ssh ${homeUserName}@${vpsIp} -p ${vpsPort}
}

# store function signature
cmdList=( "home" "vps" "office" )

OPTION=$(whiptail --title "ssh reverse tunnel Menu Dialog" --menu "Choose your option" 15 60 4 \
"0" "when you are home" \
"1" "when you are in vps" \
"2" "when you are in office"  3>&1 1>&2 2>&3)

exitStatus=$?
if [ ${exitStatus} = 0 ]; then
    echo "Your chosen option: #${OPTION} - ${cmdList[OPTION]}"
    ${cmdList[OPTION]}
else
    echo "You chose Cancel."
fi

exit 0
