"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function file(data) {
    return `FROM node:10

WORKDIR /usr/app

COPY package*.json ./

RUN npm install --quiet

COPY . .
`;
}
exports.default = file;
