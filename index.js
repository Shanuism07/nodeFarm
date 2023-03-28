// const hello = "Hello World";
// console.log(hello);
// // Now, for reading files,  we are going to use the fs module of nodejs.
// const fs = require('fs'); // calling this function with the built in fs module name will return an object
// //in which there are a lot of functions that we can use.
// // Now we will learn how to read data from a file and ho to write data into a file.
// const textIn = fs.readFileSync('./txt/input.txt', 'utf-8');//read
// console.log(textIn);
// const textOut = `This is what we know about the avocado: ${textIn}.\nCreated on ${Date.now()}`;
// fs.writeFileSync('./txt/output.txt', textOut);
// console.log("File written!");

// //Non blocking asynchronous way
// //we have used a call back function after specifying the file location below.
// fs.readFile('./txt/start.txt', (err, data1) => {
//     if(err) return console.log("Error!");
//     fs.readFile(`./txt/${data1}.txt`, 'utf-8', (err, data2) => {
//         console.log(data2);// first, the text in start file is stored in data1. Then this text acts as a source location for data2.
//         fs.readFile('./txt/append.txt', 'utf-8', (err, data3) => {
//             console.log(data3);

//             fs.writeFile('./txt/final.txt', `${data2}\n${data3}`, 'utf-8', err => {
//                console.log("your file has been written");
//             })
//         }); 
// });
// }); // by this nodejs starts reading the above file in the background and line by line reading code is not mantained.


// Web Server capable of accepting requests and sending back responses.
// const fs = require('fs');
// const http = require('http');
// const url = require('url');
// const server = http.createServer((req, res) => {

//     const pathName = req.url;
//     if(pathName == '/overview') {
//         res.end('This is overview');
//     }
//     else if(pathName == '/product') {
//         res.end("This is product");
//     }
//     else{
//         res.writeHead(404,{
//             'Conent-type': 'text/html',
//             'my-own-header': 'hello-world'
//         });// headers to inform the browser abt the content type.
//         res.end("<h1>Page not found!</h1>");
//     }
// });

// server.listen(8000, '127.0.0.1', () => {
//     console.log("Listening to request on port 8000");//After giving the address of the local host, we have used a call back function to display a message ie:listening to request on port 8000.
// }); // here it cannot exit by itself , it waits for a request.


//API is a service form which we can request some data.
//The data stored in dev-data is the data that our api will send to the client when requested.
// Making changes to the above code to enable the api.

// const fs = require('fs');
//  const http = require('http');
// const url = require('url');

// const data = fs.readFileSync(`${__dirname}/dev-data/data.json`, 'utf-8');
// const dataObj = JSON.parse(data);
// const server = http.createServer((req, res) => {

//    const pathName = req.url;
//     //Overview Page
//         if(pathName == '/overview') {
//         res.end('This is overview');
//     }
//     // Product Page
//     else if(pathName == '/product') {
//         res.end("This is product");
//      }
//      //API
//      else if(pathName == '/api') {

//         // fs.readFile(`${__dirname}/dev-data/data.json`, 'utf-8', (err, data) => {
//         //     const productData = JSON.parse(data);
//            // console.log(productData); // by doing this we have the dev-data on our terminal. Now we send this data as a response to the client request.
//             //we need to tell the browser that we are sending back json.
//             res.writeHead(200, { 'Content-type': 'application/json'});
//             res.end(data); //we dont need to read the whole text every time when the client requests for the data. We can read it once at the top.

//      }
//      // Not Found
//      else{
//         res.writeHead(404,{
//             'Conent-type': 'text/html',
//             'my-own-header': 'hello-world'
//          });// headers to inform the browser abt the content type.
//          res.end("<h1>Page not found!</h1>");
//      }
//  });

//  server.listen(8000, '127.0.0.1', () => {
//      console.log("Listening to request on port 8000");//After giving the address of the local host, we have used a call back function to display a message ie:listening to request on port 8000.
//  }); // here it cannot exit by itself , it waits for a request.

// HTML Templating

const fs = require('fs');
const http = require('http');
const url = require('url');

//we have downloaded a module slugify and we can use it using the 'require' keyword. const slugify becomes a function.
const slugify = require('slugify');
//importing the replaceTemplate module
const replaceTemplate = require('./modules/replaceTemplate');

// const replaceTemplate = (temp, product) => {
//     let output = temp.replace(/{%PRODUCTNAME%}/g, product.productName);
//     output = output.replace(/{%IMAGE%}/g, product.image);
//     output = output.replace(/{%PRICE%}/g, product.price);
//     output = output.replace(/{%FROM%}/g, product.from);
//     output = output.replace(/{%NUTRIENTS%}/g, product.nutrients);
//     output = output.replace(/{%QUANTITY%}/g, product.quantity);
//     output = output.replace(/{%DESCRIPTION%}/g, product.description);
//     output = output.replace(/{%ID%}/g, product.id);
//     if(!product.organic) output = output.replace(/{%NOT_ORGANIC%}/g, 'not-organic');
//     return output;
// }
const tempOverview = fs.readFileSync(`${__dirname}/templates/template-overview.html`, 'utf-8');
const tempCard = fs.readFileSync(`${__dirname}/templates/template-card.html`, 'utf-8');
const tempProduct = fs.readFileSync(`${__dirname}/templates/template-product.html`, 'utf-8');
const data = fs.readFileSync(`${__dirname}/dev-data/data.json`, 'utf-8');
const dataObj = JSON.parse(data);
 // lets create an array of all the slugs, we are looping over data obj and then create a new array based on that. In each iteration we take the element using 'el' and create slug out of that. 
const slugs = dataObj.map(el => slugify(el.productName, {lower: true}));
console.log(slugs);

//console.log(slugify('Fresh Avocados', {lower: true})); //syntax to use slugify.

const server = http.createServer((req, res) => {

   const {query, pathname} = url.parse(req.url, true);
    //Overview Page
        if(pathname == '/' || pathname == '/overview') {
            res.writeHead(200, { 'Content-type': 'text/html'});

            const cardsHtml = dataObj.map(el => replaceTemplate(tempCard, el)).join('');//replaceTemplate is a function, el contains objects which holds the data.
            const output = tempOverview.replace('{%PRODUCT_CARDS%}', cardsHtml);
            res.end(output);
    }
    // Product Page
    else if(pathname == '/product') {
        res.writeHead(200, { 'Content-type': 'text/html'});
        const product = dataObj[query.id];
        const output = replaceTemplate(tempProduct, product);
        res.end(output);
     }
     //API
     else if(pathname == '/api') {

        // fs.readFile(`${__dirname}/dev-data/data.json`, 'utf-8', (err, data) => {
        //     const productData = JSON.parse(data);
           // console.log(productData); // by doing this we have the dev-data on our terminal. Now we send this data as a response to the client request.
            //we need to tell the browser that we are sending back json.
            res.writeHead(200, { 'Content-type': 'application/json'});
            res.end(data); //we dont need to read the whole text every time when the client requests for the data. We can read it once at the top.

     }
     // Not Found
     else{
        res.writeHead(404,{
            'Conent-type': 'text/html',
            'my-own-header': 'hello-world'
         });// headers to inform the browser abt the content type.
         res.end("<h1>Page not found!</h1>");
     }
 });

 server.listen(8000, '127.0.0.1', () => {
     console.log("Listening to request on port 8000");//After giving the address of the local host, we have used a call back function to display a message ie:listening to request on port 8000.
 });

 //npm is a software that we basically use to manage the third party open source packages that we chose to include in our project.
 // two types of packages : regular dependencies and development dependencies