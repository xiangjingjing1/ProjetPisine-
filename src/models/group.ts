import sq from "sequelize";
import sequelize from "./connection";
import Specialty from "./speciality";
import User from "./user";
import { BelongsToManyAddAssociationMixin } from "sequelize";

class Group extends sq.Model {

    public id!: number;
    public num!: number;
    public specialtyId!: number;

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

Group.belongsTo(Specialty, { as: "specialty" });
Specialty.hasMany(Group, {
    sourceKey: "id",
    foreignKey: "specialtyId",
    as: "groups",
});
Group.belongsToMany(User, { through: UserGroup });

export {Group, UserGroup};