
export abstract class HandledError extends Error {
  code: string;
  status: number;
  reason?: string;
  constructor(message: string, code: string, status = 400) {
    super(message);
    this.reason = message;
    this.code = code;
    this.status = status;
  }
}

export class UnauthorizedE extends HandledError {
  constructor(message = "user not authorized") {
    super(message, "UNAUTHORIZED", 401);
  }
}

export class ForbiddenE extends HandledError {
  constructor(message = "user is forbidden to process requested action") {
    super(message, "FORBIDDEN", 403);
  }
}

export class WrongGroupE extends HandledError {
  constructor(message = "wrong group") {
    super(message, "WRONG_GROUP");
  }
}

export class UserNotFoundE extends HandledError {
  constructor(message = "user is not found") {
    super(message, "USER_NOT_FOUND");
  }
}

export class AlreadyExistE extends HandledError {
  constructor(message = "data already exits") {
    super(message, "ALREADY_EXIST");
  }
}

export class NotExistE extends HandledError {
  constructor(message = "data not exits") {
    super(message, "NOT_EXIST");
  }
}

export class NotAppliedE extends HandledError {
  constructor(message = "data not applied") {
    super(message, "NOT_APPLIED");
  }
}

export class InvalidFieldE extends HandledError {
  constructor(message = "invalid input field") {
    super(message, "INVALID_FIELD");
  }
}

export class MissingFieldE extends HandledError {
  constructor(message = "additional field should be given") {
    super(message, "MISSING_FIELD");
  }
}


export class InvalidDataE extends HandledError {
  constructor(message = "given data is invalid") {
    super(message, "INVALID_DATA");
  }
}

export class ManagerOnlyE extends HandledError {
  constructor(message = "only board manager can access") {
    super(message, "MANAGER_ONLY");
  }
}

export class InvalidActionE extends HandledError {
  constructor(message = "action is not valid") {
    super(message, "INVALID_ACTION");
  }
}

export class GiftishowE extends HandledError{
  constructor(message = "error from giftishow") {
    super(message, "GIFTISHOW");
  }
}