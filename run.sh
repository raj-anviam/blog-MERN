#!/bin/sh  
# /bin/su tstapps -c "
service mongod start;
cd api/;
# source ~/.nvm/nvm.sh;
nodemon &
cd ../client;
npm start;