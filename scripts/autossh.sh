#!/usr/bin/env bash
# author : owen-carter

#remoteIp=47.92.160.84
#remotePort=22
#remoteUser=dysec
#rsaPath=~/.ssh/id_rsa.pub


remoteIp=39.108.140.2
remotePort=22
bridgePort=10000
remoteUser=root
rsaPath=~/.ssh/id_rsa.pub

initAccount(){
    read -p "Please enter Vps ip:" remoteIp
    read -p "Please enter Vps port:" remotePort
    read -p "Please enter Vps user:" remoteUser
}

sudo yum install autossh openssh-server -y

if [ -e "${rsaPath}" ];
then
    echo "id_rsa.pub is already exist!"
else
    echo "id_rsa.pub is not exist!"
    ssh-keygen -t rsa
fi

sudo ssh-copy-id -p 22 -i ${rsaPath} ${remoteUser}@${remoteIp}
sudo touch /var/log/ssh_nat.log
sudo chmod 777 /var/log/ssh_nat.log

echo "Start to write the autossh.service"
sudo cat >> /lib/systemd/system/autossh.service <<EOF
[Unit]
Description=Auto SSH Tunnel
After=network-online.target

[Service]
User=root
Type=idle
ExecStart=/usr/bin/autossh -M 7777 -NR ${bridgePort}:localhost:22 ${remoteUser}@${remoteIp} -p22
ExecStop=/bin/kill -HUP $MAINPID
KillMode=process
Restart=always

[Install]
WantedBy=multi-user.target
WantedBy=graphical.target
EOF
systemctl daemon-reload
sudo chmod 644 /lib/systemd/system/autossh.service
sudo systemctl enable autossh.service
sudo systemctl start autossh.service
systemctl daemon-reload

