import { APIRequestContext, expect } from "@playwright/test";
import { APILogger } from "./logger";

export class RequestHandler {

    private request: APIRequestContext
    private logger: APILogger
    private baseUrl: string | undefined
    private defaultBaseUrl: string;
    private apiPath: string = '';
    private queryParams: object = {};
    private apiHeaders: Record<string, string> = {};
    private apiBody: object = {};

    constructor(request: APIRequestContext, apiBaseUrl: string, logger: APILogger) {
        this.request = request
        this.defaultBaseUrl = apiBaseUrl
        this.logger = logger
    }
    url(url: string) {
        this.baseUrl = url;
        return this;
    }

    path(path: string) {
        this.apiPath = path;
        return this;
    }

    params(params: object) {
        this.queryParams = params;
        return this;
    }

    headers(headers: Record<string, string>) {
        this.apiHeaders = headers;
        return this;
    }

    body(object: object) {
        this.apiBody = object;
        return this;
    }

    /**
    * @param statusCode this value is what you expect from status code of request
    */
    async getRequest(statusCode: number) { // this async method is used because of "get" method is a Promise
        const url = this.getUrl();
        this.logger.logRequest('GET', url, this.apiHeaders)
        const response = await this.request.get(url, { //this added AWAIT keyword because of "get" method is a Promise
            headers: this.apiHeaders
        })
        this.cleanupField()
        const actualStatus = response.status()
        const responseJSON = await response.json()

        this.logger.logResponse(actualStatus, responseJSON)
        this.statusCodeValidator(actualStatus, statusCode, this.getRequest)
        // expect(actualStatus).toEqual(statusCode);

        return responseJSON
    }

    async postRequest(statusCode: number) {
        const url = this.getUrl();
        this.logger.logRequest('POST', url, this.apiHeaders, this.apiBody)
        const response = await this.request.post(url, {
            headers: this.apiHeaders,
            data: this.apiBody
        })
        this.cleanupField()
        const actualStatus = response.status()
        const responseJSON = await response.json()

        this.logger.logResponse(actualStatus, responseJSON)
        this.statusCodeValidator(actualStatus, statusCode, this.postRequest)
        // expect(actualStatus).toEqual(statusCode);

        return responseJSON
    }

    async putRequest(statusCode: number) {
        const url = this.getUrl();
        this.logger.logRequest('PUT', url, this.apiHeaders, this.apiBody)
        const response = await this.request.put(url, {
            headers: this.apiHeaders,
            data: this.apiBody
        })
        this.cleanupField()
        const actualStatus = response.status()
        const responseJSON = await response.json()

        this.logger.logResponse(actualStatus, responseJSON)
        this.statusCodeValidator(actualStatus, statusCode, this.putRequest)
        // expect(actualStatus).toEqual(statusCode);

        return responseJSON
    }

    async deleteRequest(statusCode: number) {
        const url = this.getUrl();
        this.logger.logRequest('DELETE', url, this.apiHeaders)
        const response = await this.request.delete(url, {
            headers: this.apiHeaders
        })
        this.cleanupField()
        const actualStatus = response.status()

        this.logger.logResponse(actualStatus)
        this.statusCodeValidator(actualStatus, statusCode, this.deleteRequest)
        // expect(actualStatus).toEqual(statusCode);
    }

    private getUrl() {
        const url = new URL(`${this.baseUrl || this.defaultBaseUrl}${this.apiPath}`)
        for (const [key, value] of Object.entries(this.queryParams)) {
            url.searchParams.append(key, value)
        }
        this.queryParams = {}; //reset the query params so it won't affect next request
        // console.log(url.toString())
        return url.toString();
    }

    private statusCodeValidator(actualStatus: number, expectedStatus: number, callingMethod: Function) {
        if (actualStatus !== expectedStatus) {
            const logs = this.logger.getRecentLogs()
            const error = new Error(`Expected status ${expectedStatus} but got ${actualStatus}\n\nRecent API Activity: \n${logs}`)
            Error.captureStackTrace(error, callingMethod)
            throw error
        }
    }

    private cleanupField() {
        this.apiBody = {}
        this.apiHeaders = {}
        this.baseUrl = undefined
        this.apiPath = ''
        this.queryParams = {}
    }
}
