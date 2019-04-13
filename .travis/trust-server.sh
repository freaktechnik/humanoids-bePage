#! /bin/bash
eval "$(ssh-agent -s)"
chmod 600 .travis/deploy_rsa
ssh-add .travis/deploy_rsa
echo "$DEPLOY_HOST $SERVER_PUBLIC_KEY" >> $HOME/.ssh/known_hosts
