import { createServer } from 'http';
import { Server } from 'socket.io';

export default async function defineNitroPlugin({ app }) {
    const httpServer = createServer(app);
    const io = new Server(httpServer, {cors: {origin: '*',},});

    io.on('connection', (socket) => {

        socket.on('eventRepositories', (event) => {
            socket.broadcast.emit('eventRepositories', event)
        });

        socket.on('eventNotification', (event) => {
            socket.broadcast.emit('eventNotification', event)
        });

    });

    httpServer.listen(3500);
}