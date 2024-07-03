#!/bin/bash

apt update -y
apt install grub2 wimtools ntfs-3g -y

# Get the disk size in GB and convert to MB
disk_size_gb=$(parted /dev/sda --script print | awk '/^Disk \/dev\/sda:/ {print int($3)}')
disk_size_mb=$((disk_size_gb * 1024))

# Calculate partition size (50% of total size minus 1GB)
part_size_mb=$((disk_size_mb / 2 - 1024))

# Create GPT partition table
parted /dev/sda --script -- mklabel gpt

# Create two partitions
parted /dev/sda --script -- mkpart primary ntfs 1MB ${part_size_mb}MB
parted /dev/sda --script -- mkpart primary ntfs ${part_size_mb}MB $((disk_size_mb - 1024))MB

# Inform kernel of partition table changes
partprobe /dev/sda
sleep 10

# Format the partitions
mkfs.ntfs -f /dev/sda1
mkfs.ntfs -f /dev/sda2

echo "NTFS partitions created"

# Mount the first partition
mount /dev/sda1 /mnt

# Prepare directory for the Windows disk
mkdir -p /mnt/sources/virtio

# Install GRUB
grub-install --root-directory=/mnt /dev/sda

# Edit GRUB configuration
cat <<EOF > /mnt/boot/grub/grub.cfg
menuentry "Windows Installer" {
    insmod ntfs
    search --set=root --file /bootmgr
    ntldr /bootmgr
    boot
}
EOF

# Mount the Windows installation ISO
mkdir -p /root/windisk
mount -o loop /path/to/win10.iso /root/windisk

# Copy Windows files to the first partition
rsync -avz --progress /root/windisk/* /mnt

# Mount Virtio ISO and copy drivers
mkdir -p /mnt/sources/virtio
mount -o loop /path/to/virtio.iso /root/windisk
rsync -avz --progress /root/windisk/* /mnt/sources/virtio

# Create command file for WIM image update
echo 'add virtio /virtio_drivers' > /mnt/sources/cmd.txt

# Update boot.wim with Virtio drivers
wimlib-imagex update /mnt/sources/boot.wim 2 < /mnt/sources/cmd.txt

# Reboot the system
reboot
