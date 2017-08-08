#!/usr/bin/env bash

function deleteForever(){
    pathYourWantToRemoveFile=${1}
    printf "delete ${pathYourWantToRemoveFile} forever..."
    git filter-branch --force --index-filter "git rm --cached --ignore-unmatch ${pathYourWantToRemoveFile}" --prune-empty --tag-name-filter cat -- --all
    if [[ $? = 0 ]]; then
        git push origin master --force
    else
        printf "delete failed.."
    fi
}

function autoUpdate(){
    printf "start auto task..."
}