"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.isEmpty = exports.getExternalPath = exports.deepFind = exports.replaceAllNonDigits = exports.randomIntFromInterval = exports.context = exports.randomInt = exports.randomStr = exports.getRandomFloat = exports.getRandomInt = exports.isDevEnv = void 0;
const lodash_1 = __importDefault(require("lodash"));
const isDevEnv = () => {
    return (process.env.NODE_ENV === 'development' || process.env.NODE_ENV === 'test');
};
exports.isDevEnv = isDevEnv;
function getRandomInt(min, max) {
    return Math.round(Math.random() * (max - min) + min);
}
exports.getRandomInt = getRandomInt;
function getRandomFloat(min, max) {
    return parseFloat((Math.random() * (max - min) + min).toFixed(2));
}
exports.getRandomFloat = getRandomFloat;
const randomStr = (length) => {
    let text = '';
    const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    for (let i = 0; i < length; i++) {
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
};
exports.randomStr = randomStr;
const randomInt = (length) => {
    let text = '';
    const possible = '0123456789';
    for (let i = 0; i < length; i++) {
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return +text;
};
exports.randomInt = randomInt;
const context = (ctx) => {
    const { req, connection } = ctx;
    return connection
        ? {
            req: {
                headers: lodash_1.default.transform(connection.context, (result, val, key) => {
                    result[key.toLowerCase()] = val;
                }),
            },
        }
        : { req };
};
exports.context = context;
function randomIntFromInterval(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
}
exports.randomIntFromInterval = randomIntFromInterval;
function replaceAllNonDigits(theString) {
    const theNumber = Number(theString.replace(/^\D+/g, '').trim());
    return isNaN(theNumber) ? 0 : theNumber;
}
exports.replaceAllNonDigits = replaceAllNonDigits;
function deepFind(obj, path) {
    const paths = path.split('.');
    let current = obj;
    let i;
    for (i = 0; i < paths.length; ++i) {
        if (current[paths[i]] === undefined) {
            return undefined;
        }
        else {
            current = current[paths[i]];
        }
    }
    return current;
}
exports.deepFind = deepFind;
function getExternalPath(path) {
    return process.env.EXT_HOST + '/' + process.env.EXT_MIDDLEWARE + '/' + path;
}
exports.getExternalPath = getExternalPath;
function isEmpty(data) {
    if (typeof data === 'object') {
        if (JSON.stringify(data) === '{}' || JSON.stringify(data) === '[]') {
            return true;
        }
        else if (!data) {
            return true;
        }
        return false;
    }
    else if (typeof data === 'string') {
        if (!data.trim()) {
            return true;
        }
        return false;
    }
    else if (typeof data === 'undefined') {
        return true;
    }
    else {
        return false;
    }
}
exports.isEmpty = isEmpty;
