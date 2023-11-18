const {Transform} = require ('stream')
const tar         = require ('tar-stream')
const {CSVReader} = require ('csv-events')

class TarCsvReader extends Transform {

	constructor (options) {

		const test = options.test || (() => true)

		options.readableObjectMode = true
		options.writableObjectMode = false

		super (options)

		const untar = this.untar = tar.extract ()

		untar.once ('finish', () => this.emit ('end'))

		untar.on ('entry', (entry, stream, next) => {

			if (test (entry)) {

				stream.on ('error', e => this.destroy (e))
	
				const csv = new CSVReader (options)

				csv.on ('error', e => this.destroy (e))
				csv.on ('end', next)
				csv.on ('data',  r => this.push (r))

				stream.pipe (csv)

			}
			else {

				stream.resume ()

			}

			next ()
		
		})

		this.on ('pipe', src => {

			src.unpipe (this)
			src.pipe (untar)

		})

	}

	_transform (chunk, _, callback) {

		this.untar.write (chunk)

		callback ()		

	}

	_flush (callback) {

		this.untar.end ()

	}

}

module.exports = TarCsvReader