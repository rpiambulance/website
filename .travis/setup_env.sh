#!/usr/bin/env bash

cd $(dirname $0)

echo -e "
VPNC_GATEWAY=vpn.net.rpi.edu
VPNC_ID=rpi
VPNC_SECRET=${RPI_VPN_SECRET}
VPNC_USERNAME=${RPI_VPN_USERNAME}
VPNC_PASSWORD=${RPI_VPN_PASSWORD}" > .env