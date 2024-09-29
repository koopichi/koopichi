1. Add the Kali Linux Repositories and GPG Key
    Create a Keyring Directory:
    
    ```
    sudo mkdir -p /usr/share/keyrings
    ```
    Download and Add the GPG Key:
    
    ```
    wget -q -O - https://archive.kali.org/archive-key.asc | sudo gpg --dearmor -o /usr/share/keyrings/kali-archive-keyring.gpg
    ```
    Create or Edit the Sources List for Kali:
    
    ```
    sudo nano /etc/apt/sources.list.d/kali.list
    ```
    Add the Following Line to the File:
    
    ```
    deb [signed-by=/usr/share/keyrings/kali-archive-keyring.gpg] http://http.kali.org/kali kali-rolling main contrib non-free
    ```
    Update the Package List:
    
    ```
    sudo apt update
    ```
2. Install the Core Kali System
   Install debootstrap:
   
   ```
   sudo apt install debootstrap
   ```
   Create a Directory for the Kali Root Environment:

   ```
   sudo mkdir /kali-root
   ```
   Use debootstrap to Install a Minimal Kali System:

   ```
   sudo debootstrap --arch amd64 kali-rolling /kali-root http://http.kali.org/kali
   ```
3. Set Up a Chroot Environment
   Mount Necessary System Directories:

   ```
   sudo mount --bind /dev /kali-root/dev
   sudo mount --bind /proc /kali-root/proc
   sudo mount --bind /sys /kali-root/sys
   ```
   Chroot into the Kali System:

   ```
   sudo chroot /kali-root /bin/bash
   ```
4. Install Kali Linux and GRUB
   Update Package Lists Inside Chroot:

   ```
   apt update
   ```
   Install the Full Kali Linux System:

   ```
   apt install kali-desktop-gnome
   ```
   Install GRUB:
   
   ```
   apt install grub-pc
   ```
   Install GRUB to the Master Boot Record (MBR):

   ```
   grub-install /dev/sda
   ```
   Update GRUB Configuration:

   ```
   update-grub
   ```
5. Exit Chroot and Reboot
   Exit the Chroot Environment:

   ```
   exit
   ```
   Unmount the System Directories:

   ```
   sudo umount /kali-root/dev
   sudo umount /kali-root/proc
   sudo umount /kali-root/sys
   ```
   Reboot Your VPS:

   ```
   reboot
   ```

  
