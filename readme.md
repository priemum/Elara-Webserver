Getting started
- This is only a starter to get the website setup.. to accept application/json, form-data & setup the mongodb connection.
```js
const server = require("elara-webserver"), app = new server();
app
.setDirectory(require('path').join(__dirname, "views"))
.setPort(4040) 
.setSecret("YOUR SESSION SECRET")
.setMongoURL("YOUR MONGODB CONNECTION STRING") // OPTIONAL
.setViewEngine("View Engine you want to use") // Defualt: ejs
.addRoutes([
    // {
    //     name: "/mainextention",
    //     aliases: ["/other_extentions"],
    //     method: "GET", // Methods: GET, POST, PUT, DELETE, PATCH
    //     filePath: require("./routes/api") // The path to your route file you want to use for this extention.
    // }
]).startWebsite();
```

Router File Example
```js
const router = require("express").Router();
router.get("/", async (req, res) => {
    // Your code here!
})
module.exports = router; // You need to export the router to use it for the website.
```