#!/usr/bin/env bash
# this file is for auto pull the script form the github
while ( true )
do
    echo "updating ...."
    git pull origin master
    sleep 10
done
