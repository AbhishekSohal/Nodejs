console.log("Hello, World!");


//modules meansa file that contains code to be reused in other files. It can be a built-in module, a third-party module, or a custom module created by the user. Modules help to organize code and promote code reusability. In Node.js, you can use the `require` function to import modules and use their functionality in your code.
//for example, you can create a custom module called `math.js` that exports a function to greet a person:

//console.log(add(2,3));//problem is that add function is not defined in this file, it is defined in math.js file. To use the add function in this file, we need to import the math.js module using require function.

//To import the math.js module, we can use the following code:
const math = require('./math.js');
console.log(math.add(2,3)); // this will work because we have imported the math.js module and we can access the add function using math.add.
console.log(math.subtract(5,2)); // this will also work because we have imported the math.js module and we can access the subtract function using math.subtract.