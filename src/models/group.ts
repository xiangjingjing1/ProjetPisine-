import sq from "sequelize";
import sequelize from "./connection";
import Specialty from "./specialty";
import User from "./user";
import { BelongsToManyAddAssociationMixin } from "sequelize";

class Group extends sq.Model {

    public id!: number;
    public num!: number;
    public specialtyId!: number;

    public specialty?: Specialty;
    public Users?: User[];

    public addUser!: BelongsToManyAddAssociationMixin<User, number>;

}

Group.init({
    num: {
        type: sq.SMALLINT,
    },
}, {
    sequelize,
    timestamps: false,
});

class UserGroup extends sq.Model {}

UserGroup.init({
    GroupId: {
        type: sq.INTEGER,
        primaryKey: true,
    },
    UserId: {
        type: sq.INTEGER,
        primaryKey: true
    }
}, {
    sequelize,
    timestamps: false,
});

Group.belongsTo(Specialty, { 
    as: "specialty",
    onDelete: 'CASCADE',
    foreignKey: {
        allowNull: false,
    }
});
Specialty.hasMany(Group, {
    sourceKey: "id",
    foreignKey: {
        name: "specialtyId",
        allowNull: false,
    },
    as: "groups",
    onDelete: 'CASCADE'
});
Group.belongsToMany(User, { 
    through: UserGroup,
    foreignKey: {
        name: "GroupId",
        allowNull: false,
    },
    onDelete: "CASCADE",
});

export {Group, UserGroup};