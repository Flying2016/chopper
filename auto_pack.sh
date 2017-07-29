#!/usr/bin/env bash
# 自动追加文件，
timestamp=$(date)
title="auto pack system"
dialog --title "${title}" --msgbox  "current time is  ${timestamp}" 6 60

dialog --title "${title}" --yesno "are you sure to pack current system?" 6 60

echo $?
if [ "$?" -ne "0" ];then
    echo "you choose giving up to executing packing"
    exit 0
fi
dialog --clear
dialog --title '请输入模块打包时间间隔' --inputbox "默认2秒" 6 40 2>step
echo ${step}
cd src/
declare -i PERCENT=0
(
    for file in ./*;do
        if [ -f $file ];then
        stamp="// packed by owenjiao ${timestamp}"
        echo $stamp >> $file
        sync
        sleep 3
        let PERCENT+=1
        echo "XXX"
        echo "build the module ${file##*/} ..."
        echo "XXX"
        echo $PERCENT
        fi
    done
) | dialog --title "packing" --gauge "starting to pack source..." 6 100 0
sleep 60
svn commit -m "${stamp}"
cd ../dist/
svn commit -m "${stamp}"


#chown g:u ./src
