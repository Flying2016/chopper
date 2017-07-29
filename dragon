#!/usr/bin/env bash
# by owen-carter
# from http://www.111cn.net/sys/linux/75923.htm
# from http://blog.csdn.net/yuanfang_way/article/details/54383616
# http://blog.csdn.net/yuanfang_way/article/details/54383616
# 可以将文件总数写在文件名中
# 利用lsblk获取磁盘进行选择，可以提示

backup(){
    tar cvpzf backup.tgz --exclude=/proc --exclude=/lost+found --exclude=/mnt --exclude=/sys --exclude=backup.tgz /
}

recover(){
    tar xvpfz backup.tgz -C /
    mkdir proc
    mkdir lost+found
    mkdir mnt
    mkdir sys
}

OPTION=$(whiptail --title "dragon os utils" --menu "Choose your option" 10 30 2 "1" "backup system" "2" "recover system"  3>&1 1>&2 2>&3)

exitStatus=$?
if [ ${exitStatus} = 0 ]; then
    echo "Your chosen option:" ${OPTION}
else
    echo "You chose Cancel."
fi


(
    for ((i = 0 ; i <= 100 ; i+=20)); do
        sleep 1
        echo $i
    done
) | whiptail --gauge "Please wait while installing" 6 60 0



sum=0
for x in "`tar -tvvzf $1`"; do
    one=`echo "$x" | awk '{print $3}'`;
done
for x in $one; do
    sum=`expr $sum + $x`;
done

s=$sum
tar xvvf $1 | awk -v s=$s '{ a=a+$3; b=(a/s)*100;printf "%d\n",b}' | dialog --gauge "Install ..." 10 70 0

# find the disks
finDisk(){
  local cmd="ls /dev/sd?"
  return $(cmd)
}


