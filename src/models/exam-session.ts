import sq from "sequelize";
import sequelize from "./connection";
import Subject from "./subject";
import {Group} from "./group";
import {BelongsToManyGetAssociationsMixin} from "sequelize";

class ExamSession extends sq.Model {

    public id!: number;
    public date!: Date;
    public state!: number;
    public subjectId!: number;

    public getGroups!: BelongsToManyGetAssociationsMixin<Group>;

}

ExamSession.init({
    date: {
        type: sq.DATE,
        allowNull: false,
    },
    state: {
        /**
         * WAITING: 0
         * IN_PROGRESS: 1
         * FINISHED: 2
         */
        type: sq.INTEGER,
        allowNull: false,
        defaultValue: 0,
        validate: {
            min: 0,
            max: 2,
        },
    },
}, {
    sequelize,
    timestamps: false,
});

ExamSession.belongsTo(Subject);
ExamSession.belongsToMany(Group, {through: 'GroupParticipation'});

export default ExamSession;