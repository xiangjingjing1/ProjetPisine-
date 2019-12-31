import SocketIO from "socket.io";
import {User, ExamSession} from "../../models";

var userToSocket: {[userId: number]: SocketIO.Socket} = {};
var sessionsToUsersIds: {[sessionId: number]: number[]} = {};

function init(io: SocketIO.Server) {

    const adminNS = io.of("/admin");
    const studentNS = io.of("/student");

    adminNS.on('connection', (socket) => {

        /**
         * Map user id to it's socket
         */
        let user = (socket.request.user as User);
        if(userToSocket[user.id]) {
            userToSocket[user.id].disconnect();
        }

        if(user.isAdmin) {
            userToSocket[user.id] = socket;
        } else {
            delete userToSocket[user.id];
            return;
        }

        /**
         * Event sent when an admin user joins the exam session management page
         */
        socket.on('join-session', (data: any) => {

            let sessionId = parseInt(data);
            if(isNaN(sessionId)) {
                socket.emit("wrong-session");
            }

            ExamSession.findByPk(sessionId).then((session: ExamSession | null) => {

                if(session == null) {
                    socket.emit("wrong-session");
                    return null;
                }

                /**
                 * The user is an admin, we make him join admin room
                 */

                let count = (sessionsToUsersIds[session.id] || []).length;

                socket.emit("connected-count", count);

            }).catch((err: any) => {
                console.error(err);
                socket.emit("server-error");
            });

        });

    });

    studentNS.on('connection', (socket) => {

        /**
         * Map user id to it's socket
         */
        let user = (socket.request.user as User);
        if(userToSocket[user.id]) {
            userToSocket[user.id].disconnect();
        }

        if(!user.isAdmin) {
            userToSocket[user.id] = socket;
        } else {
            delete userToSocket[user.id];
            return;
        }

        /**
         * Event sent when an student user joins the exam session page
         */
        socket.on('join-session', (data: any) => {

            let sessionId = parseInt(data);
            if(isNaN(sessionId)) {
                socket.emit("wrong-session");
            }

            ExamSession.findByPk(sessionId).then((session: ExamSession | null) => {

                if(session == null) {
                    socket.emit("wrong-session");
                    return null;
                }

                var usersList = sessionsToUsersIds[session.id];
                if(!usersList) {
                    usersList = [];
                    sessionsToUsersIds[session.id] = usersList;
                }

                if(!usersList.includes(user.id)) {
                    usersList.push(user.id);
                }

                /**
                 * The user is an admin, we make him join admin room
                 */

                let count = usersList.length;

                adminNS.emit("connected-count", count);

                socket.on("disconnect", () => {
                    sessionsToUsersIds[sessionId] = sessionsToUsersIds[sessionId].filter((id) => id != user.id);
                    adminNS.emit("connected-count", sessionsToUsersIds[sessionId].length);
                });

            }).catch((err: any) => {
                console.error(err);
                socket.emit("server-error");
            });

        });

    });

}

export default {init};