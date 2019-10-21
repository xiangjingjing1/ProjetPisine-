import sequelize from "./connection";
import User from "./user";

async function init() {
    await sequelize.sync();
}

export {init, User};