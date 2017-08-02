#! /bin/sh
dd if=/dev/zero of=$1 bs=1024 count=2K
echo -e "o\nn\np\n1\n\n\nw" | fdisk $1
mkfs.ext4 -U 536bf4d3-7dee-4dc7-8569-c6c3bcff3908 "$1""1"

mkdir -p /mnt/
mount "$1""1" /mnt/
cp $2 /mnt/
cd /mnt/
tar zxvf $2

mkdir proc
mkdir sys
mkdir mnt
mkdir lost+found

cp /root/centos/*.so.* /lib/
/root/centos/grub2-install --root-directory=/mnt/ $1
rm -rf /mnt/$2

sync
sync
sync

umount "$1""1"
