import {Sequelize} from 'sequelize';

const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: 'db.sqlite'
});

sequelize.authenticate()
    .then(() => console.log("Connected to database !"))
    .catch((err: any) => console.error("Unable to connect to database.", err));

export default sequelize;