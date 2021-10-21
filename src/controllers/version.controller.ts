import { Application } from 'express';
import { BaseController } from "@classes/base-route.class";
import { Container } from 'typedi';
import { PackageService } from '@services/package.service';
import { Route } from '@classes/route.class';

export class VersionController extends BaseController {

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