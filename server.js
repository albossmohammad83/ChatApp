const http = require('http');
const WebSocket = require('ws');
const path = require('path');
const fs = require('fs');

const httpServer = http.createServer((req, res) => {
if (req.url === '/') {
    const filePath = path.join(__dirname, '/index.html');
    serveFile(res, filePath, 'text/html');    
   }
   else if (req.url === '/notification-sound.mp3') {
    const mp3filePath = path.join(__dirname, '/notification-sound.mp3');
    serveFile(res, mp3filePath, 'audio/mpeg');
   }
   else {
    res.writeHead(404);
    res.end('Not Found');
  }
});

const wss = new WebSocket.Server({ server: httpServer });

wss.on('connection', ws => {
  ws.send('Welcome to Mohammad`s server!');

  ws.on('message', message => {
    let parsedMessage;
    try {
      parsedMessage = JSON.parse(message);
      // Broadcast the message to all clients
      wss.clients.forEach(client => {
        if (client !== ws && client.readyState === WebSocket.OPEN) {
          client.send(JSON.stringify(parsedMessage));
          console.log(JSON.stringify(parsedMessage));
        }
      });
    } catch (error) {
      console.error('Error parsing message as JSON:', error);
    }
  });

  ws.on('close', () => {
    console.log('WebSocket closed');
  });
});

httpServer.listen(3000, () => {
  console.log(`app is running...`);
});

function serveFile(res, filePath, contentType) {
  fs.readFile(filePath, (err, content) => {
    if (err) {
      res.writeHead(500);
      res.end('Server Error');
      return;
    }
    res.writeHead(200, { 'Content-Type': contentType });
    res.end(content);
  });
}
