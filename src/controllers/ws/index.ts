import SocketIO from "socket.io";
import {User, ExamSession} from "../../models";

var userToSocket: {[userId: number]: SocketIO.Socket} = {};

function init(io: SocketIO.Server) {

    /**
     * Disconnect unused sockets 
     */
    io.on('connection', (socket) => {

        /**
         * Map user id to it's socket
         */
        let user = (socket.request.user as User);
        if(userToSocket[user.id]) {
            userToSocket[user.id].disconnect();
        }
        userToSocket[user.id] = socket;

        /**
         * Event sent when a student user joins an exam session or when 
         * an admin user joins the exam session management page
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

                if(user.isAdmin) {

                    /**
                     * The user is an admin, we make him join admin room
                     */
                    socket.join(`session-admin-${session.id}`);
                    
                    let count = Object.keys(io.to(`session-${session.id}`).sockets).length;
                    socket.send("connected-count", count);

                } else {

                    /**
                     * The user isn't an admin, we make him join the student room
                     */
                    socket.join(`session-${session.id}`);

                    let count = Object.keys(io.to(`session-${session.id}`).sockets).length;
                    io.to(`session-admin-${session.id}`).emit("conencted-count", count);

                }

            }).catch((err: any) => {
                console.error(err);
                socket.emit("server-error");
            });

        });

    });



}

export default {init};