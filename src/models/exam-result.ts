import sq from "sequelize";
import sequelize from "./connection";
import User from "./user";

class ExamResult extends sq.Model {

    public part!: number;
    public score!: number;
    public UserId!: number;
    public ExamSessionId!: number;

}

ExamResult.init({
    part: {
        type: sq.SMALLINT,
        allowNull: false,
        validate: {
            min: 1,
        },
        primaryKey: true,
    },
    score: {
        type: sq.SMALLINT.UNSIGNED,
        allowNull: false,
        validate: {
            min: 0,
        }
    },
    UserId: {
        type: sq.INTEGER,
        allowNull: false,
        primaryKey: true,
    },
    ExamSessionId: {
        type: sq.INTEGER,
        allowNull: false,
        primaryKey: true,
    }
}, {
    sequelize,
    timestamps: false,
});

ExamResult.belongsTo(User);

export default ExamResult;