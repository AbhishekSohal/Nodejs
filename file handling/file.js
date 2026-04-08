 const fs= require("fs");

//fs stands for file system, it is a built-in module in Node.js that allows you to work with the file system on your computer. You can use the fs module to read, write, and manipulate files and directories.
//sync..
fs.writeFileSync('./test.txt','Hello, World!'); // this will create a file called test.txt and write the string "Hello, World!" to it. If the file already exists, it will overwrite the existing content.

fs.writeFile('./test2.txt','Hello, World Async!', (err) => {}); // this will create a file called test2.txt and write the string "Hello, World!" to it. If the file already exists, it will overwrite the existing content. This is an asynchronous method, it takes a callback function as the third argument that will be called when the file is written.

//difference between sync and async is that sync methods block the execution of the code until the operation is completed, while async methods do not block the execution of the code and allow other operations to be performed while the operation is being completed. In general, it is recommended to use async methods to avoid blocking the execution of the code and improve performance.


//reading files
const data=fs.readFileSync('./contact.txt','utf-8'); // this will read the content of the file contacts.txt and return it as a string. The second argument 'utf-8' is used to specify the encoding of the file. If you do not specify the encoding, it will return a buffer object.
console.log(data);
fs.readFile('./contact.txt','utf-8', (err, data) => {
    if (err) {
        console.error(err);
        return;
    }
    else {
        console.log(data);
    }
});

//append data to a file
fs.appendFileSync('./test.txt',' This is an appended text.'); // this will append the string " This is an appended text." to the end of the file test.txt. If the file does not exist, it will create a new file and write the string to it.

// copy a file content to another file =>
fs.cpSync("./text.txt", "./copy-text.txt");

// delete a file =>
fs.unlinkSync("./copy-text.txt");

// stat of a file =>
console.log(fs.statSync("./text.txt"));

// create a folder =>
fs.mkdirSync("./text");

