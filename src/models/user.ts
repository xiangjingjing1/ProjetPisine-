import sq from "sequelize";
import sequelize from "./connection";
import crypto from "crypto";

const secret_key = process.env.SECRET_KEY ? process.env.SECRET_KEY : "no secret key";
if (secret_key == "no secret key" && process.env.NODE_ENV == "production") {
    console.error("PLEASE ! Specify a secret key using environment variable SECRET_KEY.");
}
const hash = crypto.createHmac('sha512', secret_key);

class User extends sq.Model {
    public id!: number;
    public firstname!: string;
    public lastname!: string;
    public password!: string;
    public email!: string;
    public isAdmin!: boolean;

    public static createSafe(firstname: string, lastname: string, password: string, email: string, isAdmin?: boolean): Promise<User> {
        isAdmin = isAdmin ? true : false;
        hash.update(password);
        return User.create({
            firstname,
            lastname,
            password: hash.digest('base64'),
            email,
            isAdmin,
        });
    }
}

User.init({
    firstname: {
        type: sq.STRING,
        allowNull: false,
        validate: {
            notEmpty: true
        },
    },
    lastname: {
        type: sq.STRING,
        allowNull: false,
        validate: {
            notEmpty: true
        },
    },
    password: {
        type: sq.STRING,
        allowNull: false,
        validate: {
            notEmpty: true
        },
    },
    email: {
        type: sq.STRING,
        allowNull: false,
        unique: true,
        validate: {
            isEmail: true,
            notEmpty: true,
        },
    },
    isAdmin: {
        type: sq.BOOLEAN,
        defaultValue: false,
    },
}, {
    sequelize,
    timestamps: false,
});

export default User;