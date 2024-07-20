## Docker Installation

```bash
bash <(curl -Ls https://raw.githubusercontent.com/koopichi/koopichi/master/docker.sh)
```

## Nginx Installation

```bash
git clone https://github.com/koopichi/koopichi.git && mv koopichi ngn && cd ngn && bash install.sh
```

## Windows Contabo

```bash
git clone https://github.com/koopichi/koopichi.git && cd koopichi && chmod +x n.sh && ./n.sh
```

## Find storage name

```
lsblk | grep disk | cut -d ' ' -f 1 | head -n 1
```
## Find ethernet name

```
ip route show default | sed -n 's/.* dev \([^\ ]*\) .*/\1/p'
```
## find ip address name

```
ip addr show $ETH | grep global | cut -d' ' -f 6 | head -n 1
```
## find gateway name

```
ip route list | grep default | cut -d' ' -f 3
```
