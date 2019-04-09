import express from "express";
import http from "http";
import path from "path";
import bodyParser from "body-parser";
import ShowsStorage from "../storage";
import {PAGE_SIZE} from "../config";
import ShowsApi from "../api";

// Express app initialization
const app = express();

var apiRouter = express.Router();

apiRouter.get('/shows/list', (req, res) => {
    const showsStorage = new ShowsStorage();
    const page = req.query.page;
    const offset = (page - 1) * PAGE_SIZE;
    showsStorage.count().then(total => showsStorage.list(offset, PAGE_SIZE).then(shows => {
        const api = new ShowsApi();
        const showsStorage = new ShowsStorage();
        showsStorage.listCastsByShows(shows).then(casts => {
            api.getCastFromShows(casts.map((cast, index) => {
                return {
                    show: shows[index],
                    castSize: cast.length
                };
            }).filter(data => data.castSize === 0)
                .map(data => data.show)).then(casts => {
                showsStorage.listCastsByShows(shows).then(casts => {
                    res.send({
                        page,
                        total,
                        totalPages: Math.ceil(total / PAGE_SIZE),
                        list: shows.map((show, index) => {
                            return {
                                ...show,
                                cast: casts[index]
                            }
                        })
                    });
                });
            });
        })
    }));
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
