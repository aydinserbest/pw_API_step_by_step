import { test, expect } from "@playwright/test";
import { config } from "../api-test.config";
import { request } from "http";


test('login without config', async ({ request }) => {
  const response = await request.post( 'https://conduit-api.bondaracademy.com/api/users/login', {
    data: {
      "user": {
        "email": "aydinserbest34@gmail.com",
        "password": "Sa21342134"
      }
    }
  })
  expect(response.status()).toEqual(200);
  const responseJSON = await response.json();
  
});
test('login with config', async ({ request}) => {
  const response = await request.post( `${config.apiUrl}/users/login`, {
    data: {
      "user": {
        "email": config.userEmail,
        "password": config.userPassword

      }
    }
  })
  expect(response.status()).toEqual(200);
  const responseJson =await response.json()
  console.log(responseJson)
  expect(responseJson.user.email).toEqual(config.userEmail);
})
