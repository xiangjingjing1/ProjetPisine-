import {Sequelize} from 'sequelize';

const sequelize = (() => { 

    if(process.env.NODE_ENV == "test") {
        return new Sequelize({
            dialect: 'sqlite',
            storage: 'test.sqlite',
            logging: false,
        });
    } else if(process.env.NODE_ENV == "production") {
        if(!process.env.DATABASE_URL) {
            process.exit(1);
        }
        
        /*const regex = /^postgres:\/\/([^:]+):([^@]+)@([^:]+):(\d+)\/(.+)$/;
        let result = regex.exec(process.env.DATABASE_URL);
        if(result == null) {
            process.exit(1);
        }

        let username = result[1];
        let password = result[2];
        let host = result[3];
        let port = result[4];
        let dbName = result[5];*/

        return new Sequelize(process.env.DATABASE_URL, {
            ssl: true,
        });
    } else {
        return new Sequelize({
            dialect: 'sqlite',
            storage: 'db.sqlite',
            logging: process.env.LOG_SQL == "1",
        });
    }

})();

sequelize.authenticate()
    .then(() => console.log("Connected to database !"))
    .catch((err: any) => console.error("Unable to connect to database.", err));

export default sequelize;