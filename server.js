let express=require("express"),
    cors=require("cors"),
    morgan=require("morgan"),
    path=require("path"),
    bodyParser=require("body-parser"),
    mongoose=require("mongoose");
    mongoose.connect("mongodb://localhost:27017/to-do-DB", {useNewUrlParser: true });
    mongoose.set('useCreateIndex', true);

    //Routes
    userRouter=require("./routers/user"),
    listRouter=require("./routers/list");

//Start server
let server=express();
server.use(morgan("short"));
server.use(cors({origin:true}));

server.use(express.static(path.join(__dirname,"dist")));
server.use(bodyParser.urlencoded({extended:true}));
server.use(bodyParser.json());

/* Routes */
server.use('/api/user', userRouter)
server.use('/api/list', listRouter)
// server.use((request,response)=>{
//     response.send("Not Found");
// });
server.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'dist/index.html'));
  });

/* */

server.listen(8080,()=>{
    console.log("I am Listening ......");
});
