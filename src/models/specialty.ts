import sq from "sequelize";
import sequelize from "./connection";
import { Association } from "sequelize";
import {Group} from "./group";

class Specialty extends sq.Model {

    public id!: number;
    public name!: String;
    public year!: number;

    public readonly groups?: Group[];

    public static associations: {
        groups: Association<Specialty, Group>
    };

}

Specialty.init({
    name: {
        type: sq.STRING,
        allowNull: false,
        validate: {
            notEmpty: true,
        },
    },
    year: {
        type: sq.SMALLINT,
        allowNull: false,
        validate: {
            min: 1,
            max: 5,
        },
    },
}, {
    sequelize,
    timestamps: false,
});

export default Specialty; 