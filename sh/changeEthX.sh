#!/usr/bin/env bash



dumpSeries(){
    lspci|grep Eth|awk '{print $1}'>/etc/1.txt
    exit 0
}

updateDevice(){
    for ((i=0; i<32; i++))
    do
            ifconfig eth${i} down
            mac=`ifconfig eth${i}|grep ether|awk '{print $2}'`
            nameif e${i} ${mac}
    done

    n=0
    for j in `cat /etc/1.txt`
    do
            for ((i=0; i<32; i++))
            do
                    m=`ethtool -i e${i} 2>/dev/null|grep ${j}`
                    if [ -n "$m" ]; then
                            mac=`ifconfig e${i}|grep ether|awk '{print $2}'`
                            nameif eth${n} ${mac}
                            ifconfig eth${n} up
                            n=` expr ${n} + 1`
                    fi
            done

    done
}

cmdList=("dumpSeries","updateDevice")
select cmd in ${$cmdList[@]};
do
    $(${cmd})
done



