import sq from "sequelize";
import sequelize from "./connection";
import Speciality from "./speciality";
import User from "./user";

class Group extends sq.Model {

    public id!: number;
    public num!: number;
    public specialityId!: number;

}

Group.init({
    num: {
        type: sq.SMALLINT,
    },
}, {
    sequelize,
    timestamps: false,
});

Group.belongsTo(Speciality);
Group.belongsToMany(User, {through: "UserGroup"});

export default Group;