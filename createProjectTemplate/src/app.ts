import express from 'express';
import { createServer, Server } from 'http';
import { EventEmitter } from 'stream';
import Services from './services/index'
import Models from './models/index'
import Controllers from './controllers/index';

const app = express();
const server = createServer(app);
const startupEmitter = new EventEmitter();

Models.init().then(async () => 
  await Services.init().then(async () =>
    await Controllers.init(app).then(async () =>
      startupEmitter.emit('ready')
    )
  )
)

export default { 
  listen: (port: number | string, callback: () => void): Server => {
    startupEmitter.on('ready', () => {
      if (!server.listening) {
        server.listen(port, callback);
      }
    });
    

    return server;
  }
}
export {
  app
}