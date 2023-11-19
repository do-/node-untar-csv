const fs = require ('fs')
const Path = require ('path')
const {TarCsvReader} = require ('..')
const RECORDS = [
    {id: '1', name: 'admin'},
    {id: '2', name: 'user'},
    {id: '3', name: 'supervisor'},	
]

test ('not a tar', async () =>  {

	const reader = new TarCsvReader ({
		columns: ['id', 'name']
	})

	const src = Path.join (__dirname, 'data', 'nota.tar')

	const a = []

	await expect (new Promise ((ok, fail) => {

		reader.on ('error', fail)
		reader.on ('end', ok)
		reader.on ('data', r => a.push (r))

		reader.end (fs.readFileSync (src))

	})).rejects.toThrow ()

})