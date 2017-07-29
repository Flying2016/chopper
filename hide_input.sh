#!/bin//sh
stty -echo
yum install dialog -y
dialog --title "Input your name" --no-shadow --inputbox "Please input your name:" 10 30  2 > /tmp/name.txt
dialog --title "Input your name" --inputbox "Please input your name:" 10 30  2 > /tmp/name.txt
dialog --title "Password" --insecure  --passwordbox "Please give a password for the new user:" 10 35
dialog --title   TESTING --msgbox  "this is  a test" 10  20
dialog --title "yes/no" --no-shadow --yesno "Delete the file /tmp/chensiyao.txt?" 10 30
dialog --title "The fstab" --textbox /etc/fstab  17 40
dialog --title "Pick a choice" --menu "Choose one" 12 35 5 1 "say hello to everyone" 2 "thanks for your support" 3 "exit"
dialog --title "Pick one file" --fselect /root/ 7 40
dialog --backtitle "Checklist" --checklist "Test" 20 50 10 Memory Memory_Size 1 Dsik Disk_Size 2
dialog --title "Calendar" --calendar "Date" 5 50
dialog --title "Calendar" --calendar "Date" 5 50 1 2 2013
dialog --title "installation pro" --gauge "installation" 10 30 10
for i in {1..100} ;do echo $i;done | dialog --title "installation pro" --gauge "installation" 10 30
echo "you are ligin as `whoami`"
echo "enter the database system password:"
read pw
stty echo
echo "$pw was entered"
exit 0
