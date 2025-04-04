#!/bin/bash

sleep 10s

dbus-send --system --type=method_call \
    --dest=com.nestlabs.WPANTunnelDriver \
    /com/nestlabs/WPANTunnelDriver/wfan0 \
    com.nestlabs.WPANTunnelDriver.PropSet \
    string:"interface:up" variant:boolean:true

sleep 5s

systemctl restart isc-kea-dhcp6-server
