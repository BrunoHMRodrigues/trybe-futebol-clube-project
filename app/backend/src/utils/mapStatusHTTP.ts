import { ServiceResponseErrorType, ServiceResponseSuccessType } from '../types/serviceResponse';

function mapStatusHTTP(
  type: ServiceResponseErrorType | ServiceResponseSuccessType,
): number {
  const statusHTTPMap: Record<ServiceResponseErrorType | ServiceResponseSuccessType, number> = {
    notFound: 400,
    invalid: 401,
    userNotFound: 404,
    ruleInvalid: 422,
    success: 200,
    created: 201,
  };

  return statusHTTPMap[type] || 500;
}

export default mapStatusHTTP;
