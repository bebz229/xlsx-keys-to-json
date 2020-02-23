# XLSX KEYS TO JSON

![](https://github.com/bebz229/xlsx-keys-to-json/workflows/Release/badge.svg?branch=master)

This project is a helper to convert excel keys files to json. You can use it for an i18n purpose.

From this file,

| keys | fr | en |
|:---:|:---:|:---:|
| hello.world | Bonjour | Hello|
| hello.bye | Au revoir | Bye |
| thank.you.guys | Merci | Thanks |

:warning: `keys` should be used to define keys column!

You can generate single `result.json` or multiple `fr.json`, `en.json` files.
The `en.json` looks like that 
```
{
  "hello": {
    "world": "Hello",
    "bye": "Bye"
  },
  "thank": {
    "you": {
      "guys": "Thanks"
    }
  }
}
```

## Usage

Install module locally `npm i xlsx-keys-to-json` or globally

### Cli

`xkj --src example/example.xlsx --dest example/yes/yes --name i18n_{}.json --tab 4 --multi true`

### Js

```
const { extract } = require('xlsx-keys-to-json');

extract(options);
```

## Options

| name | alias | description | default |
|---|---|---|---|
|src|s|excel file to parse||
|dest|d|destination folder|process path|
|name|n|destination filename for multiple files extraction|result.json for single extract {}.json where `{}` will be replaced by top column |
|tab|t|tab spacing in json |2|
|multi|m| single or multiple files| true |
