#!/usr/bin/env bash
#
# Build a chroot with a CentOS 6.6 base install.
#

declare ROOTPATH=/tmp/chroot

mkdir -p ${ROOTPATH}/var/lib/rpm
rpm --rebuilddb --root=${ROOTPATH}

wget http://mirror.centos.org/centos/6.6/os/x86_64/Packages/centos-release-6-6.el6.centos.12.2.x86_64.rpm
rpm -i --root=${ROOTPATH} --nodeps centos-release-6-6.*.rpm

yum --installroot=${ROOTPATH} install -y rpm-build yum

mkdir -p ${ROOTPATH}/proc
mount --bind /proc ${ROOTPATH}/proc

mkdir -p ${ROOTPATH}/dev
mount --bind /dev ${ROOTPATH}/dev

mkdir -p ${ROOTPATH}/etc
cp /etc/resolv.conf ${ROOTPATH}/etc/resolv.conf

mkdir -p ${ROOTPATH}/root
cp ${ROOTPATH}/etc/skel/.??* ${ROOTPATH}/root

rm -rf centos-release-6-6.*.rpm


