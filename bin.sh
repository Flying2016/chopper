#!/usr/bin/env bash
# author : owen-carter
scriptPath="./scripts"
scriptList=(
    "app.sh"
    "autoIp.sh"
    "autoUpdate.sh"
    "autofdisk.sh"
    "autossh.sh"
    "backup.sh"
    "backupSystem.sh"
    "changeRoot.sh"
    "developMysql.sh"
    "dragon.sh"
    "git.sh"
    "github.sh"
    "initCentos.sh"
    "installScript.sh"
    "jail.sh"
    "makeBin.sh"
    "modifyFile.sh"
    "natcat.sh"
    "sshReverseTunnel.sh"
    "tunnel.sh"
    "video.sh"
)

window=whiptail
window=dialog

menuString=""
idx=0
for idx in ${scriptList[@]}
do
    menuString="${menuString} ${idx} ${scriptList[idx]}"
    let "idx=${idx}+1"
done
menuString=menuString "${idx}" "exit"
echo menuString

OPTION=$(${window} --title "Github Menu Dialog" --menu "Choose your option" 10 60 4 "${menuString}" 3>&1 1>&2 2>&3)

exitStatus=$?
if [ ${exitStatus} = 0 ]; then
    echo "Your chosen option: #${OPTION} - ${cmdList[OPTION]}"
    ${cmdList[OPTION]}
else
    echo "You chose Cancel."
fi
exit 0
