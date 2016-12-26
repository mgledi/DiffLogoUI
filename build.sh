#!/usr/bin/env bash

cp ./package.json ./dist
cp -r ./example ./dist
cp ./start ./dist
cp -R ./src/server ./dist
tar -czvf ./dist/DiffLogoUI.tar.gz -C ./dist .
