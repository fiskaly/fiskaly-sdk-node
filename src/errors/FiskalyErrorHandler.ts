import { FiskalyClientError, FiskalyHttpError, FiskalyTimeoutError } from "./";

export class FiskalyErrorHandler {
    public static readonly HTTP_ERROR : number = -20000;
    public static readonly HTTP_TIMEOUT_ERROR : number = -21000;

    /**
     * Return appropriate Fiskaly error based on the error code
     * @param response
     */
    public static throwError(response: any) {
        if (response.error.code === this.HTTP_ERROR) {
            const responseData = response.error.data;
            const errorBody = JSON.parse(Buffer.from(responseData.response.body, 'base64').toString());
            const requestId = responseData.response.headers['x-request-id'][0];

            return new FiskalyHttpError(errorBody.message, errorBody.code, errorBody.error, errorBody.status_code, requestId);
        } else if (response.error.code === this.HTTP_TIMEOUT_ERROR) {
            return new FiskalyTimeoutError(response.error.message);
        } else {
            return new FiskalyClientError(response.error.message, response.error.code, response.error.data);
        }
    }
}
