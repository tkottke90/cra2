import { Container } from 'typedi';
import { ChildLogger, LoggerClass } from '@services/logger.service';
import { Application, NextFunction, Request, Response, Router } from 'express';
import { IRoute, IContext, IHook } from './route.class';
import { GenericDictionary } from './dictionary.class';
import _ from 'lodash';

class RoutingError extends Error {
  metadata: GenericDictionary;
  code: number;

  constructor(message: string, code: number, metadata: GenericDictionary) {
    super(message);
    this.name = 'RoutingError';
    this.code = code;
    this.metadata = metadata;
  }

}

export class BaseController implements GenericDictionary {
  public router: Router;
  public routeName: string;
  public paginate: boolean = false;
  readonly app: Application;

  routes!: IRoute[];
  protected classLogger!: ChildLogger;

  constructor(app: Application, route: string, name: string) {
    this.router = Router();
    this.app = app;
    this.routeName = route.startsWith('/') ? route : `/${route}`;

    this.configureLogger(name);
    
    let setupStatus = true;
    let setupMessage = 'Controller initialized';
    try {
      this.setupRoutes();
    } catch (err: any) {
      setupMessage = err.message;
      setupStatus = false;
    }

    this.classLogger.log(
      setupStatus ? 'info' : 'warn',
      setupMessage
    );
  }
  
  protected configureLogger(className: string): void {
    const logger = Container.get(LoggerClass);
    this.classLogger = logger.createChildLogger(className);
  }

  protected setupRoutes(): void {
    if (!this.routes || this.routes.length === 0) {
      throw new Error('Controller not initialized - No Routes Configured');
    }
  
    this.routes.forEach((route) => this.generateRoute(route));

    this.app.use(this.routeName, this.router);
  }

  private generateRoute(route: IRoute) {
    const controllerPath = route.path === '/' ? '' : route.path;

    if (!route.enabled) {
      this.classLogger.log('setup', `Skipping Disabled HTTPEndpoint: ${route.method.toUpperCase()} ${this.routeName}${controllerPath}`)
      return;
    }
    
    this.classLogger.log('setup', `Configuring HTTPEndpoint: ${route.method.toUpperCase()} ${this.routeName}${controllerPath}`);
    const classMethod = async (request: Request, response: Response, next: NextFunction) => {
      
      // Construct context object
      let context = this.generateContextObject(request, response, next);

      // Process authorization
      if (!route.authorization.verificationFn(context.user)) {
        return response.status(401).json({ message: 'Unauthorized' });
      }

      // Process before hooks
      try {
        for await (const hook of this.processHooks(context, route.hooks.before)) {
          context = hook._context;

          if (context.error) {
            const errorCode = context.error.code || 500;
            delete context.error.code;
            
            throw new RoutingError('Error occurred in before hook', errorCode, { class: route.metadata.className, method: route.metadata.methodName, hook: hook._hookIndex });
          }

          if (context.result) {
            break;
          }
        }
      } catch (error) {
        context.error = error;
        return this.processErrorHooks(context, route.hooks.error);
      }

      // Run class function
      try {
        const params: any[] = [];
        if (route.metadata.parameters.length > 0) {
          params.push(...route.metadata.parameters.map((param: string) => _.get(context, param, {})))
        }

        context.result = route.function.call(this, ...params);
      } catch (error) {
        context.error = error;
        return this.processErrorHooks(context, route.hooks.error);
      }

      // Process after hooks
      try {
        for await (const hook of this.processHooks(context, route.hooks.before)) {
          context = hook._context;

          if (context.error) {
            const errorCode = context.error.code || 500;
            delete context.error.code;

            throw new RoutingError('Error occurred in after hook', errorCode, { class: route.metadata.className, method: route.metadata.methodName, hook: hook._hookIndex });
          }

          if (context.result) {
            break;
          }
        }
      } catch (error) {
        context.error = error;
        return this.processErrorHooks(context, route.hooks.error);
      }
      
      response.json(context.result)
    };

    this.router[route.method](route.path, ...route.middleware.before, classMethod, ...route.middleware.after);
  }

  private generateContextObject(request: Request, response: Response, next: NextFunction): IContext {
    let user = undefined;

    const data = request.body || {};

    return {
      method: request.method,
      request,
      response,
      next,
      app: this.app,
      params: request.params,
      query: request.query,
      transport: 'http',
      user,
      data
    };
  }

  private processHooks = async function* (context: IContext, hooks: any[]) {
    let index = 0;
    let _context: IContext = context;

    while (index < hooks.length) {
      _context = await hooks[index](_context);
      yield { _context, _hookIndex: index };
      index++;
    }

    return _context;
  };

  private async processErrorHooks(context: IContext, errorHooks: IHook[]) {
    try {
      for await (const hook of this.processHooks(context, errorHooks)) {
        context = hook._context;
      }
            
      const code: number = context.error.code || 500;
      delete context.error.code;
      context.response.status(code).json(context.error);
    } catch (error: any) {
      this.classLogger.log('error', `Error processing the error ${context.error.message} -> ${error.message}`, { originalError: context.error, ...error });
      context.response.status(500).json(error);
    }
  }
}
