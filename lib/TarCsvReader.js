const {Transform, pipeline} = require ('stream')
const tar         = require ('tar-stream')
const {CSVReader} = require ('csv-events')

class TarCsvReader extends Transform {

	constructor (options) {

		const test = options.test || (() => true)

		options.readableObjectMode = true
		options.writableObjectMode = false

		super (options)

		const untar = this.untar = tar.extract ()

		untar.once ('error', e => this.destroy (e))

		let eof = false, open = 0, tryClose = _ => {

			if (eof && open === 0) this.emit ('end')

		}
		
		const {fileNumField} = options

		let fileNum = 0

		untar.on ('finish', () => {eof = true; tryClose ()})

		untar.on ('entry', (entry, stream, next) => {

			if (test (entry)) {

				open ++

				fileNum ++

				const csv = new CSVReader (options)
		
				csv.on ('error', e => this.destroy (e))

				csv.on ('end', _ => {open --; next (); tryClose ()})

				csv.on ('data',  r => {

					if (fileNumField != null) r [fileNumField] = fileNum

					this.push (r)

				})

				stream.pipe (csv)

			}
			else {

				stream.resume ()

				next ()

			}
		
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