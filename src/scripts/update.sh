# navigate to the root directory
cd || exit
# make the desktop our current directory
cd desktop
# now we need to make the ark alarm project our current directory
cd arkalarm
git stash
#check if project is up to date with git fetch and echo if the project is up to date.
git fetch origin
if [ $? -eq 0 ]; then
    echo "Project is up to date"
    echo "Script finished"
else
    echo "Project is not up to date"
    git pull origin master
    rm -rf node_modules
    echo "Node modules removed"
    echo "re installing node modules"
    npm install
    echo "Script finished"
fi


