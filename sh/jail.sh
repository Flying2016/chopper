#!/usr/bin/env bash

function installJail(){
    cd ~
    mkdir "tmp"
    cd "tmp"
    wget http://olivier.sessink.nl/jailkit/jailkit-2.16.tar.gz
    tar -vxzf jailkit-2.16.tar.gz
    cd jailkit-2.16/
    sudo ./debian/rules binary
}