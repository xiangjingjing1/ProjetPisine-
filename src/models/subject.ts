import sq from "sequelize";
import sequelize from "./connection";
import CorrectAnswer from "./correct-answer";
import {Association} from "sequelize";

class Subject extends sq.Model {

    public id!: number;
    public name!: String;

    public readonly answers?: CorrectAnswer[];

    public static associations: {
        answers: Association<Subject, CorrectAnswer>
    };

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