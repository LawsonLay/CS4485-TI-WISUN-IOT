## Prerequisites 

>The BeaglePlay must be running either Debian 11.8 or Debian 12.7 XFCE version. There are slight differences between the 2 versions. This does not include flashing the firmware onto the BeaglePlay or the TI-CC1352P7-1s. Please refer to [[Flashing CCS Firmware onto the BeaglePlay]] for that.

# 1.  Install ti-wisunfantund

```
sudo apt-get update
sudo apt-get install dbus libreadline8 gcc g++ libdbus-1-dev libboost-dev libreadline-dev libcoap2-bin make libtool autoconf autoconf-archive npm
git clone -b TI_WiSUN_STACK_01_00_07 https://github.com/TexasInstruments/ti-wisunfantund.git
cd ti-wisunfantund/
./bootstrap.sh
./configure --sysconfdir=/etc
make -j4
sudo make install
sudo npm install -g n
sudo n 16.13.2
```

# 2.  Build the ti-wisunfantund web app on a different host or PC

>If you are on Windows, you will probably have to use WSL or install NPM from their website.

```
git clone -b TI_WiSUN_STACK_01_00_07 https://github.com/TexasInstruments/ti-wisunfantund.git
cd ./ti-wisunfantund/
sudo apt-get install npm
sudo npm install -g n
sudo n 16.13.2
cd ./ti-wisun-webapp/
cd ./client
npm install
npm run build
cd ../server
npm install
```

# 3.  Transfer the compiled web app to the BeaglePlay

Zip up the ti-wisun-webapp folder. You will need to transfer this zip to the BeaglePlay. You can do this in many different ways:

* Access and drag and drop the the integrated VSCode server if you have it enabled via BEAGLEPLAY_IP_ADDRESS:3000
* Use a physical USB drive
* Use a transfer file tool like [croc](https://github.com/schollz/croc)

Once transferred over, continue the following on the BeaglePlay to unzip and replace the existing non-built version. We will assume the zip file is in the HOME directory.

```
unzip ti-wisun-webapp.zip
rm -r ./ti-wisunfantund/ti-wisun-webapp/
mv ./ti-wisun-webapp ./ti-wisunfantund
```

# 4. Install pyspinel

```
sudo apt install python3-pip
pip3 install --user pyserial ipaddress --break-system-packages
git clone https://github.com/TexasInstruments/ti-wisunfan-pyspinel.git
cd ./ti-wisunfan-pyspinel/
sudo python3 setup.py install
```

>We will now proceed assuming you have already flashed the firmware on the BeaglePlay's CC1352 and the CC1352P7-1. If not, follow [[Flashing CCS Firmware onto the BeaglePlay]] and then resume here.

# 5. Manually starting the Border Router and the Router Node

>For this step, you will need to open 4 terminal windows. If you are using SSH, you need to open multiple tabs on your terminal or prompt and SSH into each new instance. Do this now before proceeding.

## Terminal 1: wfantund
### Preparing the Border Router on the integrated CC1352 

The port to use wfantund on will change depending if you are using Debian 11.8 or 12.7.

For Debian 11.8 on kernel 5.5, type the following:
```
sudo wfantund -o Config:NCP:SocketPath /dev/ttyS4
```

For Debian 11.8 on kernel 6+, type the following:
```
sudo wfantund -o Config:NCP:SocketPath /dev/ttyS2
```

For Debian 12.7, type the following:
```
sudo wfantund -o Config:NCP:SocketPath /dev/play/cc1352/uart
```

This will start the Border Router on the CC1352, and it will now wait for its interface to be set up using wfanctl.

## Terminal 2: Pyspinel
### Preparing the Router Node

#### Find the Router Node port
Plug in the CC1352P7-1 that contains the Router Node firmware to the BeaglePlay's USB port. Most likely the port will be /dev/ttyACM0, but to make sure, try the following command to confirm.

`python3 -m serial.tools.list_ports -v`

The output will look like the following where the SER (Serial Number) may be different.

>/dev/ttyACM0        
>    desc: XDS110 (03.00.00.35) Embed with CMSIS-DAP
 >   hwid: USB VID:PID=0451:BEF3 SER=L45002UP LOCATION=1-1:1.0
>/dev/ttyACM1        
>   desc: XDS110 (03.00.00.35) Embed with CMSIS-DAP
>    hwid: USB VID:PID=0451:BEF3 SER=L45002UP LOCATION=1-1:1.3
>2 ports found

The CC1352P7-1 will show 2 different ports for the same serial number. Always choose the lowest number. In this example, 0 is the port we are interested in. If the port is different from 0 (if you are launching multiple Router Nodes), you will need to change the port in the following command.

```
cd ./ti-wisunfan-pyspinel/
python3 spinel-cli.py -u /dev/ttyACM0
```

## Terminal 3: wfanctl
### Opening the Border Router's interface

```
sudo wfanctl
set interface:up true
```

## Terminal 2: pyspinel
### Starting the Wi-SUN Stack on the Router Node

```
ifconfig up
wisunstack start
```

Both Border Router and Router Node should be up now and trying to connect to each other. If they fail to connect, check if their network name is the same in the firmware flashed. You can check the network's name for both Border Router and Router Node using pyspinel. Use pyspinel to the corresponding device's port, and use the `status` command to check. If not, you need to change the network name to be the same.

To check if the progress of connection, use `routerstate`. If the node has connected, it will state the following.

> 5 
> Successfully joined and operational 
> Done

## Terminal 4: ti-wisun-webapp
### Starting the web server and website

```
cd ./ti-wisunfantund/ti-wisun-webapp/server
npm run wfan
```

If it gives you an error about the port, you may need to shut down the nginx service. 

`sudo systemctl disable nginx`

You may also change the port the website is on in `ti-wisunfantund/ti-wisun-webapp/server/src/AppConstants.js` under the CONSTANTS and PORT. You can also specify the port in the command when launching. 8035 can be changed to any free port.

`node /usr/share/ti-wisun-webapp/server/src/index.js --host=0.0.0.0 --port=8035`

## Completion

At this point, everything should be running. The network should be established and connected. You may access the Web UI at `localhost:80` or the port you changed the web app to be. 