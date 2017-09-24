#!/usr/bin/env bash

function deleteForever(){
    pathYourWantToRemoveFile=${1}
    printf "delete ${pathYourWantToRemoveFile} forever..."
    git filter-branch --force --index-filter "git rm --cached --ignore-unmatch ${pathYourWantToRemoveFile}" --prune-empty --tag-name-filter cat -- --all
    if [[ $? = 0 ]]; then
        git push origin master --force
        # 清理空间
        rm -rf .git/refs/original/
        git reflog expire --expire=now --all
        git gc --prune=now
        git gc --aggressive --prune=now
    else
        printf "delete failed.."
    fi
}

function autoUpdate(){
    printf "start auto task..."
}


function tag(){
    tagName=${1}
    tagDescription=${2}
    printf "make a tag for the repo..."
    printf "show history tags..."
    git tag
    git tag -a "${tagName}" -m "${tagDescription}"
    printf "push tags into github ..."
    git push origin --tags
}


function branch(){
    git branch develop
    git checkout develop
    git push origin develop
}



function main(){

}