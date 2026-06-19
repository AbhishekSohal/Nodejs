const express = require('express');
const fs = require('fs');
const zlib = require('zlib')
const app = express()
const PORT = 8000
const path = require('path')
const status = require('express-status-monitor')
app.use(status());
// in this what is happening is that we are creating a stream of the file and then we are writing the data to the response
// we can write pipeline instead of pipe 
// pipeline is a method that is used to write the data from the readable stream to the writable stream
// it also handles error

// stream read(sample.txt)---> zipper---> fs write stream
fs.createReadStream('./sample.txt').pipe(
    zlib.createGzip().pipe(fs.createWriteStream('./sample.zip'))
);
app.get('/', (req, res) => {
    //const filePath = path.join(__dirname, 'sample.txt');
    //fs.readFile(filePath, (err, data) => {
    //    res.end(data);
    //})

    // what we are doing here is that we are creating a stream of the file and then we are writing the data to the response
    const stream = fs.createReadStream(path.join(__dirname, 'sample.txt'), 'utf-8')
    stream.on('data', (chunk) => res.write(chunk))
    stream.on('end', () => res.end())
    stream.on('error', (err) => res.end(err))
})



app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
})