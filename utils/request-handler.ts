import { APIRequestContext } from "@playwright/test";
import { test } from "@playwright/test";


export class RequestHandler {

    private request: APIRequestContext;
    private baseUrl: string | undefined;
    private defaultBaseUrl: string = "";
    private apiPath: string = "";
    private queryParams: object = {};
    private apiHeaders: Record<string, string> = {};
    private apiBody: object = {};
    private defaultAuthToken: string;
    private clearAuthFlag: boolean

    constructor(request: APIRequestContext, baseUrl: string, authToken: string = '') {
        this.request = request;
        this.baseUrl = baseUrl;
        this.defaultAuthToken = authToken;
    }
    // ✅ Set API path
    path(path: string) {
        this.apiPath = path;
        return this;  // Allow chaining
    }

    // ✅ Add query parameters
    params(params: object) {
        this.queryParams = params;
        return this;
    }

    // ✅ Add headers (including Authorization token if available)
    headers(headers: Record<string, string>) {
        this.apiHeaders = headers;
        return this;
      }

    // ✅ Add request body
    body(body: object) {
        this.apiBody = body;
        return this;
    }

    // ✅ Build full request URL
    private getUrl() {
        const url = new URL(`${this.baseUrl}${this.apiPath}`);
        for (const [key, value] of Object.entries(this.queryParams)) {
            url.searchParams.append(key, value);
        }
        return url.toString();
    }
    clearAuth(){
        this.clearAuthFlag = true;
        return this;
      }

    // ✅ Get request with method chaining
    async getRequest(statusCode: number) {
        let responseJson: any;
        const url = this.getUrl();
        
            const response = await this.request.get(url, {
                headers: this.getHeaders(),
            });
            const actualStatusCode = response.status();
            responseJson = await response.json();
        
        return responseJson;
    }



    // ✅ Post request with method chaining
    async postRequest(statusCode: number) {
        let responseJson: any;
        const url = this.getUrl();
        await test.step(`POST request to: ${url}`, async () => {
            const response = await this.request.post(url, {
                headers: this.getHeaders(),
                data: this.apiBody,
            });
            const actualStatusCode = response.status();
            responseJson = await response.json();
        })
        return responseJson;
    }

    // ✅ Delete request with method chaining
    async deleteRequest(statusCode: number) {
        const url = this.getUrl();
        await test.step(`DELETE request to: ${url}`, async () => {
            const response = await this.request.delete(url, {
                headers: this.getHeaders(),
            });
            const actualStatusCode = response.status();
        })
    }
    async putRequest(statusCode: number) {
        let responseJson: any;
        const url = this.getUrl();
        await test.step(`PUT request to: ${url}`, async () => {
            const response = await this.request.put(url, {
                headers: this.getHeaders(),
                data: this.apiBody,
            });
            const actualStatusCode = response.status();
            responseJson = await response.json();
        })

        return responseJson;
    }
    
    private getHeaders() {
        if(!this.clearAuthFlag) {
          this.apiHeaders["Authorization"] = this.apiHeaders["Authorization"] || this.defaultAuthToken;
        }
        return this.apiHeaders;
      }
    

    private cleanupFields() {
        this.apiPath = "";
        this.queryParams = {};
        this.apiHeaders = {};
        this.apiBody = {};
        this.baseUrl = undefined;
        this.clearAuthFlag = false;
    }
   
}
