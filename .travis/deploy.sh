#!/usr/bin/env bash

# Move into this directory
cd $(dirname $0)

# Create .env file that has VPN credentials
echo -e "
VPNC_GATEWAY=vpn.net.rpi.edu
VPNC_ID=rpi
VPNC_SECRET=${RPI_VPN_SECRET}
VPNC_USERNAME=${RPI_VPN_USERNAME}
VPNC_PASSWORD=${RPI_VPN_PASSWORD}" > .env

# Use docker to rsync files from build directory to Union FTP server
docker run --rm -ti -v ${TRAVIS_BUILD_DIR}:/srv --privileged --env-file .env --dns 8.8.8.8 masterodin/vpnc:latest /sbin/my_init --quiet -- /bin/sh -c "sleep 5 && sshpass -p \"${RPI_FTP_PASSWORD}\" rsync -e \"ssh -o StrictHostKeyChecking=no\" --exclude '.travis*' --exclude '.docker' --exclude '.git' --exclude '.dpl' --exclude '*.example.php' -r /srv/ ${RPI_FTP_USERNAME}@ftp.union.rpi.edu:/home/ambulanc/public_html/"
