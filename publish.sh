#!/bin/bash

  echo "------------------------------";
  echo -n "Commit message"
  read message


git commit -am "$message"
np --no-cleanup

sleep 1000