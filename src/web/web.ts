import express from "express";
import http from "http";
import path from "path";
import bodyParser from "body-parser";

// Express app initialization
const app = express();

// Template configuration
app.set("view engine", "ejs");
app.set("views", "public");

// Static files configuration
app.use("/assets", express.static(path.join(__dirname, "frontend")));

// Controllers
// app.get("/*", (req, res) => {
//     res.render("index");
// });

var apiRouter = express.Router();

apiRouter.get('/shows/list', (req, res) => { 
    res.send([]);
});

app.use('/api/', [apiRouter, function errorMiddleware(error, req, res, next) {
    if (error) {
        return res.status(500).json({error: 'There was a problem in the API'});
    }
    return next();
}]);

app.use(bodyParser.json());

// Start function
export const start = (port: number): Promise<void> => {
    const server = http.createServer(app);

    return new Promise<void>((resolve, reject) => {
        server.listen(port, resolve);
    });
};
