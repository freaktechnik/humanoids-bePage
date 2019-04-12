#! /bin/bash
if [ -z ${DEPLOY_HOST+x} ]
then
    echo "No deploy config found"
    exit 1
fi
deploy () {
    # TODO clean out assets?
    rsync -avz -e ssh $TRAVIS_BUILD_DIR/dist/ $DEPLOY_USER@$DEPLOY_HOST:~/public_html/hbp/
}
