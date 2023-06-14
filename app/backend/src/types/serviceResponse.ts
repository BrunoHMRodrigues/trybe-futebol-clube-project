// const success = 200;
// const created = 201;
// const notFound = 400;
// const invalid = 401;
// const userNotFound = 404;
// const ruleInvalid = 422;

export type ServiceResponseErrorType = 'notFound' | 'invalid' | 'userNotFound' | 'ruleInvalid';
export type ServiceResponseSuccessType = 'success' | 'created';

type ServiceReponseError = {
  status: ServiceResponseErrorType,
  data: {
    message: string
  },
};

type ServiceResponseSuccess<T> = {
  status: ServiceResponseSuccessType,
  data: T,
};

export type ServiceResponse<T> = ServiceReponseError | ServiceResponseSuccess<T>;
