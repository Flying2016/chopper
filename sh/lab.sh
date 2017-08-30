#!/usr/bin/env bash
# author    :   owen-carter
# usage     :   update my lab


workDirectory=~/workspace/
projectList=(
    "bonfire"
    "chopper"
    "husky"
    "ng-zorro-admin"
    "patent"
    "pics"
)

function updateMyProject(){
    printf "start update my project"
    for project in ${projectList[@]};
    do
        printf "[project] : ${projec}"
        cd ${workDirectory}${project}
        git pull origin master
    done
    printf "end"
}


updateMyProject
