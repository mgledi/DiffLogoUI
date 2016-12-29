#!/usr/bin/env bash

cp ./package.json ./dist
mkdir ./dist/example
cp ./example/*.pwm ./dist/example
cp ./start ./dist
cp -R ./src/server ./dist
tar -czvf ./dist/DiffLogoUI.tar.gz -C ./dist .
