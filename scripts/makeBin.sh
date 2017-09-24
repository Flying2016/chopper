#!/usr/bin/env bash
# author    :   owen-carter

declare app=./app.sh
declare installScript=./installScript.sh

function makeBin(){
    printf "start make bin...\n"
    printf "make a tarball of app...\n"
    tar jcvf app.tar.bz2 ${app}
    cat ${installScript} app.tar.bz2 > ./app.install.run
    rm app.tar.bz2
}

makeBin
