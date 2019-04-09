import { SERVER_PORT } from "./config";
import ShowsStorage from './storage';
import * as web from "./web";
import ShowsApi from "./api";

const loadShows = () => {
    const api = new ShowsApi();
    const showsStorage = new ShowsStorage();
    showsStorage.createTables();
    // showsStorage.count().then(count => {
    //     console.log(count);
    // });

    // api.list().then(response => {
    //     showsStorage.storeList(response.data);
    // });
};

async function main() {
    loadShows();
    await web.start(SERVER_PORT);
    console.log(`Server started at http://localhost:${SERVER_PORT}`);
}

main().catch(error => console.error(error));
