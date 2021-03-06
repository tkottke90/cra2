import { Application } from 'express';
import { BaseController } from "../../../lib/core/base-controller.class";
import { Container, Inject } from 'typedi';
import { PackageService } from '@services/package.service';
import { Route } from '@classes/route.class';
import { ClassLogger } from '@classes/class-logger.class';

export class VersionController extends BaseController {

  @Inject()
  private loggerService: LoggerClass;

  private packageService: PackageService;

  constructor(app: Application) {    
    super(app, 'version', 'Controller.VersionController');

    this.packageService = Container.get(PackageService);
  }

  @Route()
  getVersion() {
    return { version: this.packageService.getVersion() };
  }
  
  @Route({ path: '/build-date' })
  getBuildDate(params: any, data: any) {
    return { buildDate: '2021-09-10' }
  }

  

}

export function initialize(app: Application) {
  return new VersionController(app);
}