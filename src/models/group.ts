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

Group.belongsTo(Specialty, { as: "specialty" });
Group.belongsToMany(User, { through: "UserGroup" });

export default Group;