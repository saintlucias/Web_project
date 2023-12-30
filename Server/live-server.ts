import express from 'express';
import http from 'http';
import WebSocket from 'ws';
import cors from 'cors';

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

app.use(
  cors({
    credentials: true,
    origin: ['http://192.168.0.23:3000', 'http://localhost:3000', 'http://192.168.0.18:3000'],
  })
);

wss.on('connection', (ws: WebSocket, req: http.IncomingMessage) => {
  const clientIP: any = req.socket.remoteAddress;
  const splitIP = clientIP.split(":");
  const privateip = splitIP[3];
  console.log(`Client connected from IP address: ${privateip}`);

  switch (privateip) {
    case '192.168.0.23':
      broadcastToAll('선택님이 입장 했읍니다.');
      break;
    case '192.168.0.18':
      broadcastToAll('병석님이 입장 했읍니다.');
      break;
    case '192.168.0.31':
      broadcastToAll('철민님이 입장 했읍니다.');
      break;
    default:
      broadcastToAll(`${privateip}님이 입장 했읍니다.`);
      break;
  }

  ws.on('message', (message: string) => {
    wss.clients.forEach((client) => {
      const messageStr = `${message}`; // 배열로 나뉨
      if(ws == client && client.readyState === WebSocket.OPEN){
        client.send(`me : ${messageStr}`);
      } else {
        client.send(`other : ${messageStr}`);
      }
    });
  });
});

function broadcastToAll(message: string) {
  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(message);
    }
  });
}


const PORT = process.env.PORT || 4002;

server.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});

