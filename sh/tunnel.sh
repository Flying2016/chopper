#!/usr/bin/env bash
# author : owen-carter

function buildTarget(){
    printf ""
}




function buildBridge(){
    printf ""
}




function buildOperator(){
    printf ""
}


cmdList=( "dumpLocalhost" "initRemote" "exit" )

checkInstalled "mysql"
checkInstalled "mysqldump"
checkInstalled "dialog"
checkInstalled "whiptail"


OPTION=$(whiptail --title "Test Menu Dialog" --menu "Choose your option" 15 60 4 \
"0" "dump localhost db to sql file" \
"1" "init remote db with sql file" \
"2" "exit"  3>&1 1>&2 2>&3)

exitStatus=$?
if [ ${exitStatus} = 0 ]; then
    echo "Your chosen option: #${OPTION} - ${cmdList[OPTION]}"
    ${cmdList[OPTION]}
else
    echo "You chose Cancel."
fi

exit 0
