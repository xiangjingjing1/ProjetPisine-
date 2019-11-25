import sq from "sequelize";
import sequelize from "./connection";
import User from "./user";

class StudentAnswer extends sq.Model {

    public id!: number;
    public num!: number;
    public answer!: number;
    public userId!: number;
}

StudentAnswer.init({
    num: {
        type: sq.SMALLINT,
        allowNull: false,
        validate: {
            min: 1,
            max: 100,
        },
    },
    answer: {
        type: sq.SMALLINT,
        allowNull: false,
        // A: 1 
        // B: 2 
        // C: 3 
        // D: 4
        validate: {
            min: 1,
            max: 4,
        }
    },
}, {
    sequelize,
    timestamps: false,
});

StudentAnswer.belongsTo(User);

export default StudentAnswer;