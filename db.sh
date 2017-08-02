#!/usr/bin/env bash
# by owen-carter
echo "this shell is a utils to help you in developing mysql db"
mysqldump=/usr/local/mysql/bin/mysqldump
mysql=/usr/local/mysql/bin/mysql

checkInstalled(){
    if type $1 2>/dev/null; then
        echo "${1} exists!"
        return 0
    else
        echo "nope, no ${1} installed."
        return 1
    fi
}

localhost(){
    username="root"
    password="root"
    host="localhost"
    port="3306"
    repo="dac_mine"
}

remote(){
    username="root"
    password="root"
    host="192.168.3.135"
    port="3306"
    repo="dac_mine"
}



initRemote(){
    remote
    echo "init database ..."
    echo ${host}
    create_db_sql="CREATE DATABASE IF NOT EXISTS ${dac} DEFAULT CHARACTER SET utf8 COLLATE utf8_general_ci"
    mysql -h${host} -u${db_username} -p${db_password} -e "${create_db_sql}"
    mysql -h${host} -u${db_username} -p${db_password} -f  < ./init_db.sql

    for table in ${tables[@]};
    do
       echo "init ${table}"
       mysql -h${host} -u${db_username} -p${db_password} -f  < ./data/init_${table}.sql
    done

    echo "init database success！"
}

dumpLocalhost(){
    localhost
    echo "init database ..."
    echo ${host}
    ${mysqldump}  -h${host} -u${username} -p${password} -d --add-drop-table ${repo} > ./init_db.sql
        mkdir data
    for table in ${tables[@]};
    do
        echo "dump ${table}"
        ${mysqldump} -h${host} -u${username} -p${password} ${repo} ${table} > ./data/init_${table}.sql
    done
    echo "dump database success！"
}

declare -r tables=(
    "system_funmodule"
    "asset_type"
    "dictionary"
    "emergency_plan"
    "dispose_program"
    "eventtype"
    "eventtypecate"
    "industry"
    "loophole"
    "monitor_interface"
    "monitor_model"
    "monitor_type"
    "organization"
    "zone"
    "user"
    "role"
    "r_role_module"
)

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
