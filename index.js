const mongoose = require('mongoose'), 
      express = require('express'),
      setup = (app, port, directory, secret, view_engine = "ejs") => {
        app
        .use(express.json())
        .use(require("multer")().array())
        .use(express.urlencoded({extended: false}))   
        .set('port', port)
        .set("views", directory)
        .set("view engine", view_engine)
        .use(require('express-session')({saveUninitialized: true, resave: true, secret: secret}));
      };

module.exports = class App{
    constructor(){
        this.setup = {
            port: 3030,
            directory: null,
            secret: "Not set",
            mongo: null,
            view_engine: null
        };
        this.routes = [];
        
    };
    setPort(num){
        this.setup.port = num;
        return this;
    };
    setViewEngine(name){
        this.setup.view_engine = name;
        return this;
    };
    setSecret(string){
        this.setup.secret = string;
        return this;
    };
    setDirectory(dir){
        this.setup.directory = dir;
        return this;
    };
    setMongoURL(url){
        this.setup.mongo = url;
        return this;
    };
    addRoute(name, options = {filePath: null, method: "GET", aliases: []}){
        if(!name) {
            console.log(`The "name" you didn't provide a name.`);
            return this;
        };
        if(!options.filePath){
            console.log(`The "options.filePath" you didn't provide the require file path. Ex: require("../name_for_the_file")`);
            return this;
        }
        let methods = {
            "GET": "get",
            "POST": "post",
            "DELETE": "delete",
            "PATCH": "patch",
            "PUT": "put"
        };
        if(!methods[options.method]){
            console.log(`The "options.method" you provided isn't valid!\nValid Methods: GET, POST, DELETE, PATCH, PUT`)
            return this;
        };
        let names = options.aliases;
        options.aliases.push(name);
        this.routes.push({names: names, filePath: options.filePath, method: methods[options.method]});
        return this;
    };
    addRoutes(routes = []){
        if(routes.length === 0) {
            console.log(`[ROUTES] - The 'addRoutes' you provided is an empty array.`);
            return this;
        };
        routes.map(r => this.addRoute(r.name, {filePath: r.filePath, method: r.method, aliases: r.aliases}));
        return this;
    };
    startWebsite(){
        this.app = express();
        setup(
            this.app, 
            this.setup.port ? this.setup.port : 4000, 
            this.setup.directory ? this.setup.directory : null, 
            this.setup.secret ? this.setup.secret : "NOT SET", 
            this.setup.view_engine ? this.setup.view_engine : "ejs"
        );
        if(this.setup.mongo !== null) this.mongoConnect(this.setup.mongo);
        if(this.routes.length !== 0){
            for (const r of this.routes){
                this.app[r.method](r.names, r.filePath);
            };
        };
        setTimeout(() => {
        this.app.listen(this.setup.port, () => console.log(`[Website] - Started\nListening to port: ${this.setup.port}`));
        }, 5000)
        return this.app;
    };
    mongoConnect(url){
        if(!url) return console.log(`[Setup, Mongodb] | Mongodb URL wasn't included`);
        mongoose.connect(url, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useFindAndModify: true
        }).then(() => console.log(`[Mongodb] - Connected`)).catch(err => {
            console.log(`[Mongodb, Error] | Process ended`, err.stack);
            return process.exit(1);
        });
        return this;
    };
}
