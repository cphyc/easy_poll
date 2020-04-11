#!/usr/bin/bash
# Runs a mongodb database with the right version (4.2)

PWD=/home/ccc/Documents/prog/easy_poll
cd $PWD
mkdir -p data
DATA=$PWD/data
sudo docker run -d -p 27017:27017 -v $DATA:/data/db mongo:4.2
