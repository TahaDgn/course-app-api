const http = require('http');
const os = require('os');

const server = http.createServer((req , res) => {
    const {headers , url , method} = req
    console.log(headers , url , method);
    res.end();
})

const PORT = 5001;

const SERVER_INFO = () => {
    return {
        osx : os.platform(),
        archx : os.arch(),
        memory : os.totalmem() / Math.pow(10,3)
    }
}


server.listen(PORT , () => console.log(`Server is running on port : ${PORT}
SERVER_OS : ${SERVER_INFO().osx}\nSERVER_ARCH : ${SERVER_INFO().archx}\nSERVER_MEM : ${SERVER_INFO().memory}`));