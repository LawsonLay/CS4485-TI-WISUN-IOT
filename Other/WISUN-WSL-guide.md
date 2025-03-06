> independent steps: 1 vs. 2 vs. 3 vs. 4

# 1. install wfantund
```
sudo apt-get update
sudo apt-get install dbus libreadline8 gcc g++ libdbus-1-dev libboost-dev libreadline-dev libcoap2-bin libcoap3-bin make libtool autoconf autoconf-archive npm
git clone -b TI_WiSUN_STACK_01_00_07  https://github.com/TexasInstruments/ti-wisunfantund.git
cd ti-wisunfantund/
./bootstrap.sh
./configure --sysconfdir=/etc
make
 sudo make install
 cd ./ti-wisun-webapp/
sudo npm install -g n
sudo n 16.13.2
sudo node --version
cd ./client
npm install
npm run build
cd ../server
npm install
```

# 2. install pyspinel
```
sudo apt install python3-pip
pip3 install --user pyserial ipaddress --break-system-packages
git clone https://github.com/TexasInstruments/ti-wisunfan-pyspinel.git
cd ./ti-wisunfan-pyspinel/
sudo python3 setup.py install
```

# 3. flash images (.od) files onto launchpads
download `firmware.zip`
pick one (use sticky note) to label it, flash one with the (dhcp-server-disabled)
flash the other launchpad with the (node)

# 4. usbipd install+config (with WSL)
source: https://learn.microsoft.com/en-us/windows/wsl/connect-usb
1. install https://github.com/dorssel/usbipd-win/releases/download/v4.4.0/usbipd-win_4.4.0.msi
2. run the .smi
3. open powershell (admin)
4. plug one of the things in
5. `usbipd list`
6. plug one of the things in
`usbipd bind --busid <busid>`
	ex:`usbipd bind --busid 2-1`
		`usbipd bind --busid 2-2`

8. `usbipd list` with new status
9. have WSL/ubuntu open in the background

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
 sudo wfantund -o Config:NCP:SocketPath <insert-border-router-port-name>
    example:
sudo wfantund -o Config:NCP:SocketPath /dev/ttyACM0
```
terminal 3
```
cd ./ti-wisunfan-pyspinel/
python3 spinel-cli.py -u <insert-router-node-port-name>
    example:
python3 spinel-cli.py -u /dev/ttyACM2
```

terminal 4/wfanctl
```
sudo wfanctl
set interface:up true
```
go back to terminal 3/pyspinel
```
ifconfig up
wisunstack start
routerstate
```
check that terminal-3:pyspinel: `routerstate` returns 
```
> 5 
> Successfully joined and operational 
> Done
```
and terminal-4: `get connecteddevices`
```
> connecteddevices = "
> List of connected devices currently in routing table:
> 2020:abcd:0000:0000:0212:4b00:29bd:a2eb
> Number of connected devices: 1
```
terminal 5/webapp
```
cd ./ti-wisunfantund/ti-wisun-webapp/server
npm run wfan
```
