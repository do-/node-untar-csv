const fs = require ('fs')
const Path = require ('path')
const {TarCsvReader} = require ('..')
const RECORDS = [
    {id: '1', name: 'admin'},
    {id: '2', name: 'user'},
    {id: '3', name: 'supervisor'},	
]

test ('pipe', async () =>  {

	const reader = new TarCsvReader ({
		columns: ['id', 'name']
	})

	const src = Path.join (__dirname, 'data', 'roles.tar')

	const a = []

	await new Promise ((ok, fail) => {

		reader.on ('error', fail)
		reader.on ('end', ok)
		reader.on ('data', r => a.push (r))

		fs.createReadStream (src).pipe (reader)

	})

	expect (a).toStrictEqual (RECORDS)

})