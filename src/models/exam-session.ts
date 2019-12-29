import sq from "sequelize";
import sequelize from "./connection";
import Subject from "./subject";
import {Group} from "./group";
import ExamResult from "./exam-result";
import {BelongsToManyGetAssociationsMixin, BelongsToManyAddAssociationMixin} from "sequelize";

class ExamSession extends sq.Model {

    public static WAITING = 0;
    public static IN_PROGRESS = 1;
    public static FINISHED = 2;

    public id!: number;
    public date!: Date;
    public state!: number;
    public subjectId!: number;

    public getGroups!: BelongsToManyGetAssociationsMixin<Group>;
    public addGroup!: BelongsToManyAddAssociationMixin<Group, number>;

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

class GroupParticipation extends sq.Model {

    public ExamSessionId!: number;
    public GroupId!: number;

}

GroupParticipation.init({
    ExamSessionId: {
        type: sq.INTEGER,
        primaryKey: true,
    },
    GroupId: {
        type: sq.INTEGER,
        primaryKey: true,
    }
}, {
    sequelize,
    timestamps: false,
});

ExamSession.belongsTo(Subject);
ExamSession.belongsToMany(Group, {
    through: GroupParticipation,
    foreignKey: {
        name: "ExamSessionId",
        allowNull: false,
    },
    onDelete: "CASCADE"
});
ExamResult.belongsTo(ExamSession);

export {ExamSession, GroupParticipation};