import sq from "sequelize";
import sequelize from "./connection";
import User from "./user";
import ExamSession from "./exam-session";

class ExamResult extends sq.Model {

    public id!: number;
    public part!: number;
    public score!: number;
    public userId!: number;
    public examSessionId!: number;
}

ExamResult.init({
    part: {
        type: sq.SMALLINT,
        allowNull: false,
        validate: {
            min: 1,
        },
    },
    score: {
        type: sq.SMALLINT.UNSIGNED,
        allowNull: false,
        validate: {
            min: 0,
        }
    },
}, {
    sequelize,
    timestamps: false,
});

ExamResult.belongsTo(User);
ExamResult.belongsTo(ExamSession);

export default ExamResult;