#!/bin/bash
  DIR=$(cd "$(dirname "$0")/.."; pwd)

  cd $DIR
  
  echo "------------------------------";
  echo -n "Commit message"
  read message


git commit -am "$message"
np --no-cleanup

sleep 1000