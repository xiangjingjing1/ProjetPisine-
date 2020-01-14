import sq from "sequelize";
import sequelize from "./connection";
import Subject from "./subject";
import {Group} from "./group";
import ExamResult from "./exam-result";
import {BelongsToManyGetAssociationsMixin, BelongsToManyAddAssociationMixin} from "sequelize";

class ExamSession extends sq.Model {

    public static WAITING = 0;
    public static IN_PROGRESS = 1;
    public static FINISHED = -1;

    public id!: number;
    public date!: Date;
    public state!: number;
    public SubjectId!: number;

    public getGroups!: BelongsToManyGetAssociationsMixin<Group>;
    public addGroup!: BelongsToManyAddAssociationMixin<Group, number>;

    public Groups?: Group[];

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
         * FINISHED: -1
         */
        type: sq.INTEGER,
        allowNull: false,
        defaultValue: 0,
        validate: {
            min: -1,
            max: 1,
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

// ExamSession <=> Subject association
ExamSession.belongsTo(Subject, {
    onDelete: 'CASCADE',
    foreignKey: {
        name: 'SubjectId',
        allowNull: false,
    }
});
Subject.hasMany(ExamSession, {
    sourceKey: 'id',
    foreignKey: {
        name: 'SubjectId',
        allowNull: false,
    },
    onDelete: 'CASCADE',
});

// ExamSession <=> Group association
ExamSession.belongsToMany(Group, {
    through: GroupParticipation,
    foreignKey: {
        name: "ExamSessionId",
        allowNull: false,
    },
    onDelete: "CASCADE"
});
Group.belongsToMany(ExamSession, {
    through: GroupParticipation,
    foreignKey: {
        name: "GroupId",
        allowNull: false,
    },
    onDelete: 'CASCADE',
});

// ExamSession <=> ExamResult association
ExamResult.belongsTo(ExamSession, {
    foreignKey: {
        name: "ExamSessionId",
        allowNull: false,
    },
    onDelete: 'CASCADE',
});
ExamSession.hasMany(ExamResult, {
    sourceKey: 'id',
    foreignKey: {
        name: "ExamSessionId",
        allowNull: false,
    },
    onDelete: 'CASCADE',
});

export {ExamSession, GroupParticipation};