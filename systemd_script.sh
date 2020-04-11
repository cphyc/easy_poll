#!/usr/bin/bash

DATE=`date '+%Y-%m-%d %H:%M:%S'`
echo "Running easy_poll, started at ${DATE}" | systemd-cat -p info

# Move to working directory
cd "$(dirname "$0")"

# Check node version
if [[ ! "$(node --version)" == "v8."* ]]; then
    echo "Wrong node version!"
    exit 1
fi

while :
do
    echo "(Re)starting easy_poll...";
    node_modules/grunt/bin/grunt serve:dist
done