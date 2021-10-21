import pkg from '@package';
import { Service } from 'typedi';

@Service()
export class PackageService {

  getVersion() {
    return pkg.version;
  }

}