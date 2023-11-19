![workflow](https://github.com/do-/node-untar-csv/actions/workflows/main.yml/badge.svg)
![Jest coverage](./badges/coverage-jest%20coverage.svg)

`untar-csv` is a node.js library for reading contents of a [tar](https://en.wikipedia.org/wiki/Tar_(computing)) containing multiple similarly structured [CSV](https://datatracker.ietf.org/doc/html/rfc4180) files as a single [stream](https://nodejs.org/docs/latest/api/stream.html) of objects.

# Installation
```bash
npm install untar-csv
```
# Usage
```js
const fs = require ('fs')
const zlib = require ('zlib')

const {TarCsvReader} = require ('untar-csv')

const reader = TarCsvReader ({
//  test: entry => entry.name.indexOf ('.csv') > -1,
//  delimiter: ',',
//  skip: 0,           // header lines
//  empty: null,
    columns: ['id', 'name'],
})

fs.createReadStream ('lots-of-data.tar.gz').pipe (zlib.createGunzip ()).pipe (reader)

for await (const {id, name} of reader) {
// do something with `id` and `name` 
}
```

# Options
Most options are effectively passed to [CSVReader](https://github.com/do-/node-csv-events/wiki/CSVReader), see there for details.

|Name|Default value|Description|
|-|-|-|
|`test`| `({name}) => true` |tar entry filter, structure described at [tar-stream](https://github.com/mafintosh/tar-stream)|
|`columns`| |Array of column definitions|
|`delimiter`|`','`|Column delimiter|
|`skip`|`0`|Number of header lines to ignore|
|`empty`|`null`|The `value` corresponding to zero length cell content|
