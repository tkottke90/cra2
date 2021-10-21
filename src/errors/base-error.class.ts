import { GenericDictionary } from "@classes/dictionary.class";

export default class BaseError extends Error {

  metadata: GenericDictionary = {};

  constructor(message: string, name: string) {
    super(message)

    this.name = name;
  }

  addMetadata(metadata: GenericDictionary): BaseError {
    this.metadata = Object.assign(metadata);

    return this;
  }

  toJSON() {
    return  ({ ...this, message: this.message })
  }
}