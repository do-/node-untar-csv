const fs = require ('fs')
const Path = require ('path')
const {TarCsvReader} = require ('..')
const RECORDS = [
    {FILE_NUM: 1, ROW_NUM: 1, id: '1', name: 'admin'},
    {FILE_NUM: 1, ROW_NUM: 2, id: '2', name: 'user'},
    {FILE_NUM: 2, ROW_NUM: 1, id: '3', name: 'supervisor'},	
]

test ('pipe', async () =>  {

	const reader = new TarCsvReader ({
		columns: ['id', 'name'],
		delimiter: ';',
		rowNumField: 'ROW_NUM',
		fileNumField: 'FILE_NUM',
	})

	const src = Path.join (__dirname, 'data', 'semi-colon.tar')

	const a = []

	await new Promise ((ok, fail) => {

		reader.on ('error', fail)
		reader.on ('end', ok)
		reader.on ('data', r => a.push (r))

		fs.createReadStream (src).pipe (reader)

	})

	expect (a).toStrictEqual (RECORDS)

})