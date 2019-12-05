import sq from "sequelize";
import sequelize from "./connection";

class Subject extends sq.Model {

    public id!: number;
    public name!: String;

}

Subject.init({
    name: {
        type: sq.STRING,
        allowNull: false,
        validate: {
            notEmpty: true,
        },
    },
}, {
    sequelize,
    timestamps: false,
});

export default Subject;