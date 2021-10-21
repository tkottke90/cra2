import { Service } from "typedi";
import EnvironmentService from "./environment.service";
import { ChildLogger, LoggerClass } from "./logger.service";

@Service()
export class FeatureServiceClass {

  public readonly featureFlags = [];
  
  private classLogger: ChildLogger;

  constructor(
    private environment: EnvironmentService,
    private logger: LoggerClass
  ) {
    this.classLogger = this.logger.createChildLogger('Service.FeatureService');

    this.classLogger.log('info', 'starting features service');
  }

  /**
   * Get a feature flag
   * @param name Key used to access the feature flag
   * @returns Boolean representing the state of the flag
   */
  getFlag(name: string): boolean {
    return this.environment.get(name);
  }

  /**
   * Toggles a flag on and off
   * @param name Name of the flag
   * @param userId The userId of the user making the change
   */
  toggleFlag(name: string, userId: string): void {
    const flagState = this.environment.get(name);

    this.classLogger.log('info', `${!flagState ? 'Enabled' : 'Disabled'} feature "${name}"`, { userId })
    this.environment.set(name, !flagState, true);
  }

}