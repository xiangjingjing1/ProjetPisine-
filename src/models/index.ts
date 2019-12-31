import sequelize from "./connection";
import User from "./user";
import CorrectAnswer from "./correct-answer";
import ExamResult from "./exam-result";
import {ExamSession, GroupParticipation} from "./exam-session";
import {Group, UserGroup} from "./group";
import Specialty from "./specialty";
import StudentAnswer from "./student-answer";
import Subject from "./subject";

async function init() {
    if(process.env.NODE_ENV == "test") {
        await sequelize.drop();
    }

    await sequelize.sync();

    if(process.env.NODE_ENV == "test") {
        try {
            await User.createSafe("Web", "Master", "admin", "admin@etu.umontpellier.fr", true);
            const ig = await Specialty.create({
                name: "IG",
                year: "3"
            });
            await Group.create({
                specialtyId: ig.id,
                num: "1"
            });
        } catch {
            process.exit(1);
        }
    }
}

export {init, User, CorrectAnswer, ExamResult, ExamSession, Group, Specialty, StudentAnswer, Subject, UserGroup, GroupParticipation};