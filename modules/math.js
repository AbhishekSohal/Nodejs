function add(a,b){
    return a+b;
}
function subtract(a,b){
    return a-b;
}
///module.exports=add;//now problem is that we are exporting only add function, if we want to export both add and subtract functions, we can use the following code:
module.exports={
    add:add,
    subtract:subtract
};//now we are exporting both add and subtract functions as an object. We can access these functions in the hello.js file using math.add and math.subtract.