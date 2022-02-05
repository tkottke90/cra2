import { Service } from 'typedi';

enum MapPositions {
  mutable,
  value
}

type EnvironmentErrorMethod = 'get' | 'set';

class EnvironmentError extends Error {
  public method: EnvironmentErrorMethod;
  public metadata: Record<string, any>;
  
  constructor(message: string, method: EnvironmentErrorMethod, metadata: Record<string, any> = {}) {
    super(message);

    this.name = "EnvironmentError"
    this.method = method;
    this.metadata = metadata;
  }
}

@Service()
export default class EnvironmentService {
  private environment: Map<string, any> = new Map<string, [ boolean, any ]>();

  constructor() {
    this.environment.set('NODE_ENV', process.env.NODE_ENV || 'development');
    this.environment.set('PORT', process.env.PORT || 3030);
    this.environment.set('IS_DEVELOPMENT', process.env.NODE_ENV === 'development')
  }

  /**
   * Get a value from the environment if it is present
   * @param {string} envName Name of the environment to look up
   * @returns {*} The value stored in the application or undefined
   */
  get(envName: string) {
    return this.environment.get(envName);
  }

  /**
   * Store a value in the environment
   * @param {string} envName Key used to store the environment
   * @param {*} value Value to be stored
   * @param {boolean} [mutable=true] If the environment variable can be changed
   */
  set(envName: string, value: any, mutable: boolean = false) {
    let mutability = mutable;
    
    if (this.environment.has(envName)) {
      const env = this.environment.get(envName);
      mutability = env[MapPositions.mutable];

      // We should not allow immutable environment variables to be updated
      if (!mutability) {
        throw new EnvironmentError(`${envName} is an immutable variable`, 'set');
      }
    }
    
    this.environment.set(
      envName,
      [ mutability , value ]
    );
  }
}