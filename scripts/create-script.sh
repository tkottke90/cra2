#! /bin/bash

readarray -t myfiles < <(find src -type f)
readarray -t mydirs < <(find src -type d)
declare -a configfiles=("nodemon.json" "tsconfig.json")

BUILD_DATE=$(date +%F)

OUTPUT_FILE='./dist/create-app.sh'

function newline() {
  echo "" >> $OUTPUT_FILE
}

function print() {
  echo "echo $1" >> $OUTPUT_FILE
}

function createFile() {
  filename=$1
  filevalue=$2

  echo "cat << 'EOF' > $filename" >> $OUTPUT_FILE
  echo -e "$filevalue" >> $OUTPUT_FILE
  echo "EOF" >> $OUTPUT_FILE
  newline
}

echo '#! /bin/bash' > $OUTPUT_FILE

echo "######################################################" >> $OUTPUT_FILE
echo "#  CRA2 Create Script                                #" >> $OUTPUT_FILE
echo "#                                                    #" >> $OUTPUT_FILE
echo "#    Author: Thomas Kottke <t.kottke90@gmail.com>    #" >> $OUTPUT_FILE
echo "#    Build Date: $BUILD_DATE                          #" >> $OUTPUT_FILE
echo "######################################################" >> $OUTPUT_FILE
newline

echo "########################" >> $OUTPUT_FILE
echo "#    Create Config     #" >> $OUTPUT_FILE
echo "########################" >> $OUTPUT_FILE

echo "read -p \"What is the name of the API? \" appname" >> $OUTPUT_FILE
echo "read -p \"What is the initial version? \" appversion" >> $OUTPUT_FILE
echo "read -p \"Who are you? \" appauthor" >> $OUTPUT_FILE
newline
packageFile=$(cat << 'EOF'
{
  "name": "$appname",
  "version": "$appversion",
  "main": "dist/index.js",
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1"
  },
  "keywords": [],
  "author": "$appauthor",
  "license": "ISC",
  "directories": {
    "doc": "docs",
    "test": "test"
  },
  "description": "",
  "dependencies": {
    "bcrypt": "5.0.1",
    "cookie-parser": "1.4.5",
    "dotenv": "10.0.0",
    "express": "4.17.1",
    "helmet": "4.6.0",
    "http-terminator": "3.0.0",
    "jsonwebtoken": "8.5.1",
    "lodash": "4.17.21",
    "pg": "8.7.1",
    "sequelize": "6.6.5",
    "uuid": "8.3.2",
    "winston": "3.3.3"
  },
  "devDependencies": {
    "@types/bcrypt": "5.0.0",
    "@types/bluebird": "3.5.36",
    "@types/chai": "4.2.21",
    "@types/cookie-parser": "1.4.2",
    "@types/express": "4.17.13",
    "@types/helmet": "4.0.0",
    "@types/jsonwebtoken": "8.5.5",
    "@types/mocha": "9.0.0",
    "@types/node": "16.9.2",
    "@types/sequelize": "4.28.10",
    "@types/uuid": "8.3.1",
    "@types/validator": "13.6.3",
    "chai": "4.3.4",
    "chai-http": "4.3.0",
    "eslint": "7.32.0",
    "mocha": "9.1.1",
    "nodemon": "2.0.12",
    "reflect-metadata": "0.1.13",
    "sequelize-cli": "6.2.0",
    "sequelize-typescript": "2.1.0",
    "sinon": "11.1.2",
    "sinon-chai": "3.7.0",
    "ts-node": "10.2.1",
    "tsconfig-paths": "3.11.0",
    "typedi": "0.10.0",
    "typescript": "4.4.3"
  }
}
EOF
)

echo 'cat << EOF > package.json' >> $OUTPUT_FILE
echo "$packageFile" >> $OUTPUT_FILE
echo 'EOF' >> $OUTPUT_FILE

newline
for i in "${configfiles[@]}"
do
  print "Creating Config: $i"
  value=`cat $i`

  createFile $i "$value"
done

echo "##########################" >> $OUTPUT_FILE
echo "#  Install Dependencies  #" >> $OUTPUT_FILE
echo "##########################" >> $OUTPUT_FILE
print "Installing Depenencies..."
echo "npm install" >> $OUTPUT_FILE
newline 

echo "########################" >> $OUTPUT_FILE
echo "#  Create Directories  #" >> $OUTPUT_FILE
echo "########################" >> $OUTPUT_FILE
newline

echo "$mydirs"
for d in "${mydirs[@]}"
do
  print "Creating Directory: $d"
  echo "mkdir -p $d" >> $OUTPUT_FILE
  newline
done
newline
newline
echo "#######################" >> $OUTPUT_FILE
echo "#     Create Files    #" >> $OUTPUT_FILE
echo "#######################" >> $OUTPUT_FILE
newline
for i in "${myfiles[@]}"
do
  print "Creating File: $i"
  value=$(cat $i)

  createFile $i "$value"
done