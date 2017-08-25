#!/usr/bin/env bash
# author    :   owen-carter
# usage     :   install app

appDirectoryName="app"
appPackageName=./${appDirectoryName}.tar.gz

# common
function parseApp(){
    printf "start parse app package ..."
    sed -n -e '1,/^exit 0$/!p' $0 > ${appPackageName} 2>/dev/null
}

# you need to implement the app install method procedure
function installApp(){
    local publishPath="/opt/${appDirectoryName}"
    tar jxvf ./${appPackageName}
    ls -alh ./${appPackageName}
    cp -R -v ${appDirectoryName} ${publishPath}
    cd ${appDirectoryName}
    # private procedure
}

parseApp
installApp
exit 0