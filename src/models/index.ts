import sequelize from "./connection";
import User from "./user";
import CorrectAnswer from "./correct-answer";
import ExamResult from "./exam-result";
import ExamSession from "./exam-session";
import {Group, UserGroup} from "./group";
import Specialty from "./specialty";
import StudentAnswer from "./student-answer";
import Subject from "./subject";

async function init() {
    await sequelize.sync();
}

export {init, User, CorrectAnswer, ExamResult, ExamSession, Group, Specialty, StudentAnswer, Subject, UserGroup};