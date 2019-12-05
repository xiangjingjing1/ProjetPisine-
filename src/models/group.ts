import sq from "sequelize";
import sequelize from "./connection";
import Specialty from "./speciality";
import User from "./user";

class Group extends sq.Model {

    public id!: number;
    public num!: number;
    public specialtyId!: number;

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