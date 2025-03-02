import { request } from "@playwright/test";
import { config } from "../api-test.config";

// 🔹 This function logs in and returns an authentication token
export async function getToken(): Promise<string>{
    const reqContext = await request.newContext(); // Ensures a fresh request context for isolation
    const response = await reqContext.post(`${config.apiUrl}/users/login`, {
        data: {
            "user": {
                "email": config.userEmail,
                "password": config.userPassword
            }
        }
    })
    if (response.status() !== 200) {
        throw new Error(`Login failed! Status code: ${response.status()}`);
    }
    const responseJSON = await response.json();
    return "Token " + responseJSON.user.token;
}