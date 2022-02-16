import socketio, { Socket, Server } from 'socket.io';

export async function startSocket(server: any) {
const io = new Server(server);

    io.on("connection", function (socket: Socket) {
        console.log("a user connected", socket.id);
    
        socket.on("getData", (userId: number) => {
            console.log(userId);
    
            socket.emit("finish", true);
            
        });
    
        socket.on('disconnect', () => {
            console.log('disconnect');
            
        });
    });
}