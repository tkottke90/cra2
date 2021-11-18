import BaseError from "./base-error.class";

export default class HTTPError extends BaseError {

  code: number;

  constructor(message: string, code: number) {
    super(message, 'HTTPError');

    this.code = code;
  }

}

export class BadRequest extends HTTPError {
  constructor(message: string) {
    super(message, 400);

    this.name = 'BadRequestError';
  }
}

export class NotAuthorized extends HTTPError {
  constructor(message: string) {
    super(message, 401);

    this.name = 'NotAuthorizedError';
  }
}

export class Forbidden extends HTTPError {
  constructor(message: string) {
    super(message, 403);

    this.name = 'ForbiddenError';
  }
}

export class NotFound extends HTTPError {
  constructor(message: string) {
    super(message, 404);

    this.name = 'NotFoundError';
  }
}

export class NotAllowed extends HTTPError {
  constructor(message: string) {
    super(message, 405);

    this.name = 'NotAllowedError';
  }
}

export class NotAcceptable extends HTTPError {
  constructor(message: string) {
    super(message, 406);

    this.name = 'NotAcceptableError';
  }
}

export class Conflict extends HTTPError {
  constructor(message: string) {
    super(message, 409);

    this.name = 'NotAcceptableError';
  }
}

export class InternalServerError extends HTTPError {
  constructor(message: string) {
    super(message, 500);

    this.name = 'NotAcceptableError';
  }
}

export class NotImplemented extends HTTPError {
  constructor(message: string) {
    super(message, 501);

    this.name = 'NotAcceptableError';
  }
}