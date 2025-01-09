import http , {Server , IncomingMessage , ServerResponse} from 'http';

const hostname: string = '127.0.0.1'
const port: number = 5000;

const server: Server = http.createServer((IncomingMessage, response)=>{

    response.statusCode = 200;
    // response.setHeader(,);
    // response.end(<h3>Welcome to Node js server</h3> );


});


server.listen(port, hostname, ()=>{
    console.log(`Node js server is started at http://${hostname}`);
});

// const app = express();

// app.use((req, res, next) => {
//   RequestContext.create(orm.em, next);
// });