To manually install Kali Linux using a bootstrap or chroot environment, we'll transform your existing Ubuntu VPS into a Kali Linux environment without needing a full reinstallation. This process is useful in environments where you can't boot from external media like USB drives. Here's a step-by-step guide to achieve this:

Overview of the Process
Step 1: Add the Kali Linux repositories.
Step 2: Install the core Kali Linux system.
Step 3: Set up a chroot environment.
Step 4: Install GRUB and configure it to boot Kali Linux.
Step 5: Finalize the installation and reboot into Kali Linux.
Steps to Bootstrap Kali Linux on Your VPS
Step 1: Add Kali Linux Repositories to Ubuntu
We will start by adding the Kali Linux repositories to the Ubuntu system to allow you to install Kali-specific packages.

Open the sources list:

```
sudo nano /etc/apt/sources.list
```
Add the following Kali repositories at the end of the file:

```
deb http://http.kali.org/kali kali-rolling main non-free contrib
deb-src http://http.kali.org/kali kali-rolling main non-free contrib
```
Save and exit by pressing CTRL + X, then Y, and Enter.

Update the package lists and install the Kali keyring:

```
sudo apt update
sudo apt install kali-archive-keyring
```
Update the package list again to include the Kali repository:

```
sudo apt update
```
Step 2: Install the Core Kali System

Next, you'll install the essential Kali packages on your VPS.

Install debootstrap (this tool installs a basic Debian system in a directory, which is compatible with Kali):

```
sudo apt install debootstrap
```
Create a directory for the Kali root environment:

```
sudo mkdir /kali-root
```
Use debootstrap to install a minimal Kali system into /kali-root:

```
sudo debootstrap --arch amd64 kali-rolling /kali-root http://http.kali.org/kali
```
This will take some time, as it downloads and installs the base system.

Step 3: Set Up a Chroot Environment

Now, we will configure the chroot environment so that you can work within the Kali Linux environment.

Mount necessary system directories inside /kali-root:

```
sudo mount --bind /dev /kali-root/dev
sudo mount --bind /proc /kali-root/proc
sudo mount --bind /sys /kali-root/sys
```
Chroot into the Kali system:

```
sudo chroot /kali-root /bin/bash
```
Now you are inside the Kali Linux environment, but it's still minimal.

Step 4: Install Kali Linux and GRUB
Inside the chroot environment, you will install the full Kali Linux system and configure the bootloader (GRUB).

Update package lists inside chroot:

```
apt update
```
Install the full Kali Linux system or only the tools you need: For the full Kali Linux experience:

```
apt install kali-linux-full
```
Alternatively, for a minimal installation:

```
apt install kali-linux-core
```
Install GRUB so your VPS can boot into Kali:

```
apt install grub-pc
```
Install GRUB to the master boot record (MBR) of your VPS disk (usually /dev/sda):

```
grub-install /dev/sda
```
Update GRUB configuration to detect the new Kali Linux installation:

```
update-grub
```
GRUB should now be set up to boot into Kali Linux.

Step 5: Exit Chroot and Reboot
Exit the chroot environment:
```
exit
```
Unmount the system directories:

```
sudo umount /kali-root/dev
sudo umount /kali-root/proc
sudo umount /kali-root/sys
```
Reboot your VPS:

```
sudo reboot
```
