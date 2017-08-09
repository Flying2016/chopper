#!/usr/bin/env bash
# by owen-carter
filename=./url.csv
while read line
do
    echo ${line}
    wget ${line}
done < ${filename}