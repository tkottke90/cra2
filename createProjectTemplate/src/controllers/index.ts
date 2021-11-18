import { readdir } from 'fs';
import { promisify } from 'util';
import { resolve } from 'path';
import { Application } from 'express';

class ControllerIndexClass {
  
  async init(app: Application) {
    const files = await promisify(readdir)(__dirname);
    await Promise.all(
      files.map(async (fileName) => {
        if (/.*\.controller\.ts/.test(fileName)) {
          const module = await import(resolve(__dirname, fileName));

          module.initialize(app)
        }
      })
    );
  };

}

export default new ControllerIndexClass();