import { readdir } from 'fs';
import { promisify } from 'util';
import { resolve } from 'path';

export default abstract class DirectoryParserClass {

  private importFile(directoryPath: string, pattern: RegExp) {
    return async (fileName: string) => {
      
      if (pattern.test(fileName)) {
        await import(resolve(directoryPath, fileName));
      }
    }
  }

  async parseDirectoryPath(path: string, pattern: RegExp) {
    const files = await promisify(readdir)(path);

    return Promise.allSettled(files.map(this.importFile(path, pattern)));
  }

  abstract init(): void;
}