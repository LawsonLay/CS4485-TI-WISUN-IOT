> independent steps: 1 vs. 2 vs. 3 vs. 4

# 1. install wfantund
```
    1  sudo apt-get update
    2  sudo apt-get install dbus libreadline8
    3  sudo apt-get install gcc g++ libdbus-1-dev libboost-dev libreadline-dev
    4  sudo apt-get install libcoap3-bin
    5  sudo apt-get install make
    8  git clone -b TI_WiSUN_STACK_01_00_07  https://github.com/TexasInstruments/ti-wisunfantund.git
   10  cd ti-wisunfantund/
   12  sudo apt-get install libtool autoconf autoconf-archive
   15  ./bootstrap.sh
   16  ./configure --sysconfdir=/etc
   17  make
   18  sudo make install
   19  cd ./ti-wisun-webapp/
   20  sudo apt install npm
   21  sudo npm install -g n
   22  sudo n 16.13.2
   23  sudo node --version
   24  cd ./client
   25  npm install
   26  npm run build
   27  cd ../server
   28  npm install
```
# 2. install pyspinel
```
   30  sudo apt install python3-pip
   38  pip3 install --user pyserial ipaddress --break-system-packages
   39  git clone https://github.com/TexasInstruments/ti-wisunfan-pyspinel.git
   40  cd ./ti-wisunfan-pyspinel/
   41  sudo python3 setup.py install
```


# 3. flash images (.od) files onto launchpads
download `firmware.zip`
pick one (use sticky note) to label it, flash one with the (dhcp-server-disabled)
flash the other launchpad with the (node)

# 4. usbipd install+config (with WSL)
source: https://learn.microsoft.com/en-us/windows/wsl/connect-usb
1.  install https://github.com/dorssel/usbipd-win/releases/download/v4.4.0/usbipd-win_4.4.0.msi
2. run the .smi
3. open powershell (admin)
4. plug one of the things in
5. `usbipd list`
6. plug one of the things in

`usbipd bind --busid <busid`
7. `usbipd bind --busid 2-1`
8. `usbipd bind --busid 2-2`

9. `usbipd list` with new status
10. have WSL/ubuntu open in the background

`usbipd attach --wsl --busid <busid>`
11. `usbipd attach --wsl --busid 2-1`
12. `usbipd attach --wsl --busid 2-2`


# 5. wisun quickstart guide

## 5.1
plug one in:
`python3 -m serial.tools.list_ports -v`
note that on a notepad (the SERIAL / node or borderrouter / port name
port name is `/dev/ttyACM0` or `/dev/ttyACM2` and so one


## 5.2
have 5 WSL terminals opens, and execute this in sequence


terminal 1
```
ip a
```
terminal 2
```
    1  sudo wfantund -o Config:NCP:SocketPath <insert-border-router-port-name>
    aka
    sudo wfantund -o Config:NCP:SocketPath /dev/ttyACM0

```
terminal 3
```
    1  ls
    2  cd ./ti-wisunfan-pyspinel/
    5  python3 spinel-cli.py -u <insert-router-node-port-name>
    aka
    python3 spinel-cli.py -u /dev/ttyACM2
    6  set interface:up true
```

terminal 4/wfanctl
```
    1  sudo wfanctl
```
go back to terminal 3/pyspinel
```
ifconfig up
wisunsack start

routerstart
```

terminal 5/webapp
```
    2  cd ./ti-wisunfantund/ti-wisun-webapp/ti-wisun-webapp
    5  cd ./server
    6  npm run wfan
```
