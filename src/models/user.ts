import sq from "sequelize";
import sequelize from "./connection";

class User extends sq.Model {
    public id!: number;
    public name!: string;
    public password!: string;
}

User.init({
    name: {
        type: sq.STRING,
        allowNull: false,
    },
    password: {
        type: sq.STRING,
        allowNull: false
    },
}, {
    sequelize,
    timestamps: false,
});

export default User;