#! /bin/bash
eval "$(ssh-agent -s)"
openssl aes-256-cbc -K $encrypted_f65e690cb8c7_key -iv $encrypted_f65e690cb8c7_iv -in $TRAVIS_BUILD_DIR/.travis/deploy_rsa.enc -out /tmp/deploy_rsa -d
chmod 600 /tmp/deploy_rsa
ssh-add /tmp/deploy_rsa
echo "$DEPLOY_HOST $SERVER_PUBLIC_KEY" >> $HOME/.ssh/known_hosts
