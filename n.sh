#!/bin/bash

# Update and upgrade the system
apt update -y && apt upgrade -y

# Install necessary packages
apt install grub2 wimtools ntfs-3g -y

#Get the disk size in GB and convert to MB
disk_size_gb=$(parted /dev/sda --script print | awk '/^Disk \/dev\/sda:/ {print int($3)}')
disk_size_mb=$((disk_size_gb * 1024))

#Calculate partition size (25% of total size)
part_size_mb=$((disk_size_mb / 4))

#Create GPT partition table
parted /dev/sda --script -- mklabel gpt

#Create two partitions
parted /dev/sda --script -- mkpart primary ntfs 1MB ${part_size_mb}MB
parted /dev/sda --script -- mkpart primary ntfs ${part_size_mb}MB $((2 * part_size_mb))MB

# Inform kernel of partition table changes
partprobe /dev/sda

# Wait for changes to take effect
sleep 30
partprobe /dev/sda
sleep 30
partprobe /dev/sda
sleep 30

# Format the partitions
mkfs.ntfs -f /dev/sda1
mkfs.ntfs -f /dev/sda2

echo "NTFS partitions created"

# Convert partition table to GPT
echo -e "r\ng\np\nw\nY\n" | gdisk /dev/sda

# Mount the first partition
mount /dev/sda1 /mnt

# Prepare directory for the Windows disk
mkdir ~/windisk
mount /dev/sda2 ~/windisk

# Install GRUB
grub-install --root-directory=/mnt /dev/sda

# Edit GRUB configuration
cat <<EOF > /mnt/boot/grub/grub.cfg
menuentry "windows installer" {
    insmod ntfs
    search --set=root --file=/bootmgr
    ntldr /bootmgr
    boot
}
EOF

# Download Windows ISO
cd ~/windisk
mkdir winfile
wget https://tech.navazi.net/win10.iso -O win10.iso

# Mount Windows ISO and copy files
mount -o loop win10.iso winfile
rsync -avz --progress winfile/* /mnt
umount winfile

# Download Virtio drivers
wget -O virtio.iso https://fedorapeople.org/groups/virt/virtio-win/direct-downloads/archive-virtio/virtio-win-0.1.240-1/virtio-win-0.1.240.iso

# Mount Virtio ISO and copy files
mount -o loop virtio.iso winfile
mkdir /mnt/sources/virtio
rsync -avz --progress winfile/* /mnt/sources/virtio

# Add Virtio drivers to boot.wim
cd /mnt/sources
touch cmd.txt
echo 'add virtio /virtio_drivers' >> cmd.txt
wimlib-imagex update boot.wim 2 < cmd.txt

# Reboot to Windows installer
reboot
