const http = require('http');
const os = require('os');


const mockData = [
    {id : 1 , text : 'data-1'},
    {id : 2 , text : 'data-2'},
    {id : 3 , text : 'data-3'},
    {id : 4 , text : 'data-4'},
    {id : 5 , text : 'data-5'},
]

class ResObj{
    constructor(success , ...datas){
        this.success = success;
        this.datas = datas;
    }
    
    fillSelf(statusCode){
        if (statusCode === 200 || 201 || 204) {
            this.success = true;
            this.datas = mockData;
        } else {
            this.success = false;
            this.datas = [];
        }
    }
}

const server = http.createServer((req , res) => {
    const {method , url} = req;
    let body = []
    req.on('data',chunk => {
        body.push(chunk);
    }).on('end' , () => {
        body = Buffer.concat(body).toString();
        console.log(body);
    });

    let status = 404;
    res.writeHead(status,{
        'Content-Type' : 'application/json',
        'X-Powered-By' : 'Node.Js',
    });

    let resObj = new ResObj();
    if (method === 'GET' && url === '/datas') {
        status = 200,
        resObj.fillSelf(status);
    } else if(method === 'POST' && url === '/datas'){
        const {id , text} = JSON.parse(body);
        mockData.push({id , text});
        status = 201;
        resObj.fillSelf(status);
    }
    res.end(JSON.stringify(resObj));
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