import socketio, { Socket, Server } from 'socket.io';
import { Prisma, PrismaClient } from "@prisma/client";
import jwt from 'jsonwebtoken';
import { errorMessage } from '../utils/error-message.enum';
import { Scraper } from '../scripts/scraper';

const prismaClient = Prisma;
const prisma = new PrismaClient();

export async function startSocket(server: any) {
  const io = new Server(server);
  io.use(function (socket: Socket, next) {
    if (socket.handshake.query && socket.handshake.query.token) {
      const token: any = socket?.handshake?.query.token;
      const decoded: any = jwt.verify(token, process.env.TOKEN_KEY || '');
      if (decoded) {
        socket.tokenData = decoded;
        next();
      }
    }
    else {
      next(new Error(errorMessage.noAccessPermission));
    }
  })
    .on("connection", function (socket: Socket) {
      console.log("a user connected", socket.id);
      // console.log("user Data: ", socket.tokenData);
      if (socket.tokenData) {
        const scraper = new Scraper(Number(socket.tokenData.id));
        scraper.start();
      }


      socket.on('disconnect', () => {
        console.log('disconnect');

      });
    });
}