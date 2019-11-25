import sq from "sequelize";
import sequelize from "./connection";

class Speciality extends sq.Model {

    public id!: number;
    public name!: String;
    public year!: number;

}

Speciality.init({
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

export default Speciality;