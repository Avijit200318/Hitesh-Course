const http = require("http");

const hostname = '127.0.0.1'
const port = 3000;

// now for every route ourserver send the same message. but it should send different messages for different route
// const server = http.createServer((req, res) => {
//     res.statusCode = 200;
//     res.setHeader('Content-Type', 'text/plain');
//     res.end("Hello world");
// })

// this is the code how our server is response
const server = http.createServer((req, res) => {
   if (req.url === '/') {
     res.statusCode = 200;
     res.setHeader('Content-Type', 'text/plain');
     res.end("Hello world");
   }
   else if(req.url == '/ice-tea'){
    res.statusCode = 200;
     res.setHeader('Content-Type', 'text/plain');
     res.end("thanks for the ice tea");
   }
   else{
    res.statusCode = 404;
     res.setHeader('Content-Type', 'text/plain');
     res.end("404 page not found");
   }
})
// but the problem is that how many if else statement can we write for a big project? so we need to write it in a better format

// how our server is listen
server.listen(port, hostname, () => {
    console.log(`server is running at http://${hostname}:${port}`);
})