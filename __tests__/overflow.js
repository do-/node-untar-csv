const fs = require ('fs')
const Path = require ('path')
const {TarCsvReader} = require ('..')
const RECORDS = [
    {id: '1', name: 'admin'},
    {id: '2', name: 'user'},
    {id: '3', name: 'supervisor'},	
]

test ('overflow', async () =>  {

	const reader = new TarCsvReader ({
		columns: ['id', 'name'],
		maxLength: 1
	})

	const src = Path.join (__dirname, 'data', 'roles.tar')

	const a = []

	await expect (new Promise ((ok, fail) => {

		reader.on ('error', fail)
		reader.on ('end', ok)
		reader.on ('data', r => a.push (r))

		reader.end (fs.readFileSync (src))

	})).rejects.toThrow ()

})