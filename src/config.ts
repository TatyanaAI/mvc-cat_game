import { ConnectionOptions } from "typeorm";
import path from "path";


export default {
    db: <ConnectionOptions>{
        type: "mysql",
        host: "localhost",
        port: 3306,
        username: "dbadmin",
        password: "dbadmin",
        database: "catgame",
        entities: [
            path.join(__dirname, "/**/**.entity{.ts,.js}")
        ],
        synchronize: true,
        logging: false
    }
};