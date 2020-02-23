const xlsx = require('node-xlsx');
const fs = require('fs');
const lib = require('../lib');
const { mutateObj, read, parse, extract } = lib;

jest.mock('node-xlsx');
jest.mock('fs');

describe('xlsx-keys-to-json', () => {
    describe('#read', () => {
        afterEach(() => {
            xlsx.parse.mockReset();
        });

        test('should use path as is', () => {
            const xlsPath = 'path.xls';
            read(xlsPath);

            expect(xlsx.parse.mock.calls[0][0]).toBe(xlsPath);
        });

        test('should add extension to path', () => {
            const xlsPath = 'path';
            read(xlsPath);

            expect(xlsx.parse.mock.calls[0][0]).toBe(xlsPath + '.xlsx');
        });
    });

    describe('#mutateObj', () => {
        test('should set deep key on existing obj', () => {
            const obj = { a: { b: 1 } };
            const expected = { a: { b: 1, c: { d: 2 } } };

            mutateObj(obj, 'a.c.d', 2);

            expect(obj).toEqual(expected);
        });

        test('should set key on existing obj', () => {
            const obj = { a: { b: 1 } };
            const expected = { a: 5 };

            mutateObj(obj, 'a', 5);

            expect(obj).toEqual(expected);
        });
    });

    describe('#parse', () => {
        test('should create json for mutilpe sheets', () => {
            const sheetsRows = [
                {
                    data: [
                        ['keys', 'fr', 'en'],
                        ['a.b.c', 1, 1],
                        ['a.b.d', 10, 10],
                    ]
                },
                {
                    data: [
                        ['keys', 'fr', 'en'],
                        ['a.b.e', 1, 1],
                    ]
                }
            ];
            const json = parse(sheetsRows);
            const expected = {
                fr: {
                    a: {
                        b: {
                            c: 1, d: 10, e: 1
                        }
                    }
                },
                en: {
                    a: {
                        b: {
                            c: 1, d: 10, e: 1
                        }
                    }
                },
            };

            expect(json).toEqual(expected);
        });
    });

    describe('#extract', () => {
        const parsedData = {
          fr: { x: 1 },
          en: { x: 2 }
        };
        let writeJsonSpy;

        beforeEach(() => {
            jest.spyOn(lib, 'read').mockReturnValue([]);
            jest.spyOn(lib, 'parse').mockReturnValue(parsedData);
            writeJsonSpy = jest.spyOn(lib, 'writeJson');
        });

        afterEach(() => {
           fs.mkdirSync.mockReset();
           writeJsonSpy.mockReset();
        });

        test('should write result.json', () => {
            extract({ multi: false });

            expect(writeJsonSpy.mock.calls[0][0]).toEqual({
                obj: parsedData,
                dest: '',
                tab: 2
            });
        });

        test('should create different files', () => {
            extract({});
            expect(writeJsonSpy.mock.calls[0][0]).toEqual({
                obj: parsedData.fr,
                dest: '',
                name: 'fr.json',
                tab: 2
            });
            expect(writeJsonSpy.mock.calls[1][0]).toEqual({
                obj: parsedData.en,
                dest: '',
                name: 'en.json',
                tab: 2
            });
        });
    });
});
