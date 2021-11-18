export default class BaseError extends Error {

  metadata: Record<string, any> = {};

  constructor(message: string, name: string) {
    super(message)

    this.name = name;
  }

  addMetadata(metadata: Record<string, any>): BaseError {
    this.metadata = Object.assign(metadata);

    return this;
  }

  toJSON() {
    return  ({ ...this, message: this.message })
  }
}