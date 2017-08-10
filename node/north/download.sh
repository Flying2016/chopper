#!/usr/bin/env bash
# by owen-carter
filename=./url.csv
while read line
do
    echo ${line}
    curl ${line}
    sleep 60
done < ${filename}

