#!/bin/bash

wget https://download.mikrotik.com/routeros/7.11.2/chr-7.11.2.img.zip -O chr.img.zip && \
gunzip -c chr.img.zip > chr.img && \
STORAGE=$(lsblk | grep disk | awk '{print $1}' | head -n 1) && \
echo "STORAGE is $STORAGE" && \
ETH=$(ip route show default | awk '/default/ {print $5}') && \
echo "ETH is $ETH" && \
ADDRESS=$(ip addr show $ETH | grep global | awk '{print $2}' | head -n 1) && \
echo "ADDRESS is $ADDRESS" && \
GATEWAY=$(ip route list | grep default | awk '{print $3}') && \
echo "GATEWAY is $GATEWAY" && \
sleep 5 && \
dd if=chr.img of=/dev/$STORAGE bs=4M oflag=sync && \
echo "Ok, reboot" && \
echo 1 > /proc/sys/kernel/sysrq && \
echo b > /proc/sysrq-trigger
