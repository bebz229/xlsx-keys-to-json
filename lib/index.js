#!/usr/bin/env
const xlsx = require('node-xlsx');
const fs = require('fs');
const path = require('path');

function read(xlsxPath) {
    return xlsx.parse(xlsxPath.includes('.xls') ? xlsxPath : xlsxPath + '.xlsx');
}

function mutateObj(obj, dotKey, value) {
    if (!dotKey) { return; }
    const keys = dotKey.split('.');
    const lastKey = keys.pop();
    let mutatedObj = obj;

    if (keys.length) {
        keys.forEach(key => {
            if (!mutatedObj[key]) {
                mutatedObj[key] = {};
            }
            mutatedObj = mutatedObj[key];
        });
    }
    mutatedObj[lastKey] = value;
}

function parse(sheetsRows) {
    const jsonObject = {};

    sheetsRows.forEach(sheetFullRows => {
        const sheetRows = sheetFullRows.data.filter(arr => arr && arr.length);
        const sheetRowsLength = sheetRows.length;
        const keysRowIndex = sheetRows.findIndex(row => row[0] === 'keys');
        const keysRow = sheetRows[keysRowIndex];
        const rowLength = keysRow.length;

        for (let i = 1; i < rowLength; i++) {
            if (!jsonObject[keysRow[i]]) {
                jsonObject[keysRow[i]] = {};
            }
        }

        for (let i = keysRowIndex + 1; i < sheetRowsLength; i++) {
            const sheetRow = sheetRows[i];
            const rowKey = sheetRow[0];

            for (let j = 1; j < rowLength; j++) {
                moduleExports.mutateObj(jsonObject[keysRow[j]], rowKey, sheetRow[j]);
            }
        }
    });

    return jsonObject;
}

function writeJson(options) {
    const { obj, dest = __dirname, name = 'result.json', tab = 2 } = options;
    const fileName = path.join(dest, name);
    fs.writeFileSync(fileName, JSON.stringify(obj, null, tab) + '\n');
    console.log('Just wrote', fileName);
}

function extract(options) {
    const { src, name = '{}.json', multi = true, dest = '', tab = 2 } = options;
    const sheetsRows = moduleExports.read(src);
    const obj = moduleExports.parse(sheetsRows);
    fs.mkdirSync(dest, { recursive: true });

    if (multi) {
        Object.keys(obj).forEach(key => {
            moduleExports.writeJson({
                obj: obj[key],
                dest,
                name: name.replace('{}', key),
                tab
            });
        });
    } else {
        moduleExports.writeJson({ obj, dest, tab });
    }
}

const moduleExports = {
    read, mutateObj, parse, extract, writeJson
};

module.exports = moduleExports;
