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