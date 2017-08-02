#!/usr/bin/env bash
# by owen-carter

function randomIp(){
    return 192.168.3.2
}

while true ;
do
    echo "change ip"
    ifconfig eth0 $(randomIp)
    sleep 5
done