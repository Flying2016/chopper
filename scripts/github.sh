#!/usr/bin/env bash
# author : owen-carter
# usage  : auto clone github repo

declare repos
repos=`curl -s  https://api.github.com/users/owen-carter/repos | grep '"name"' | sed s/[[:space:]]//g | sed s/name//g | sed s/\"//g | sed s/\,//g | sed s/\://g`

initRepos(){
    for repo in ${repos[@]}:
    do
        git clone https://github.com/owen-carter/${repo}.git
    done
}


updateRepos(){
    for repo in ${repos[@]}:
    do
        cd ${repo}
        git pull origin master
    done
}


cmdList=( "initRepos" "updateRepos" "exit" )
window=whiptail
window=dialog

OPTION=$(${window} --title "Github Menu Dialog" --menu "Choose your option" 10 60 4 \
"0" "just clone your repos into local" \
"1" "update your repos" \
"2" "exit"  3>&1 1>&2 2>&3)

exitStatus=$?
if [ ${exitStatus} = 0 ]; then
    echo "Your chosen option: #${OPTION} - ${cmdList[OPTION]}"
    ${cmdList[OPTION]}
else
    echo "You chose Cancel."
fi
exit 0



