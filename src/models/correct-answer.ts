import sq from "sequelize";
import sequelize from "./connection";
import Subject from "./subject";

class CorrectAnswer extends sq.Model {

    public num!: number;
    public answer!: number;
    public subjectId!: number;

}

CorrectAnswer.init({
    num: {
        type: sq.SMALLINT,
        allowNull: false,
        validate: {
            min: 1,
            max: 100,
        },
        primaryKey: true,
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
    subjectId: {
        type: sq.INTEGER,
        primaryKey: true,
    }
}, {
    sequelize,
    timestamps: false,
});

CorrectAnswer.belongsTo(Subject, {
    onDelete: 'CASCADE',
    foreignKey: {
        name: "subjectId",
        allowNull: false,
    }
});
Subject.hasMany(CorrectAnswer, {
    sourceKey: "id",
    foreignKey: {
        name: "subjectId",
        allowNull: false,
    },
    as: "answers",
    onDelete: 'CASCADE'
});

export default CorrectAnswer;