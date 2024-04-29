export SHELL=/bin/bash
sudo apt update -y
sudo apt install openssh-server nodejs npm -y
sudo apt upgrade -y
sudo service ssh restart
sudo npm install -g pnpm