import { test, expect } from "@playwright/test";
import { config } from "../api-test.config";
import { getToken } from "../helpers/getToken";


/*
  Test case description:
  This test performs a full authentication cycle within the test itself.
 - ✅ Login to the application (inline authentication)
 - ✅ Fetch articles **without authentication** (only public articles)
 - ✅ Fetch articles **with authentication** (includes user-created articles)
 - ✅ Create an article and validate that article count increases
 - ✅ Delete the created article and validate the cleanup
⚠️ **Limitation:** The login logic is hardcoded inside the test, making it non-reusable. 
   → The next step will be to refactor this by moving authentication to a helper function.
*/

test('Login and fetch articles with token"', async ({ request}) => {
  //Perform login and get auth token
  const response = await request.post( `${config.apiUrl}/users/login`, {
    data: {
      "user": {
        "email": config.userEmail,
        "password": config.userPassword

      }
    }
  })
  expect(response.status()).toEqual(200);
  const responseJSON = await response.json()
  const authToken ="Token " + responseJSON.user.token

  //Create a new article (Authenticated request)

  const createArticle = await request.post(`${config.apiUrl}/articles`, {
    headers: {
      Authorization: authToken
    },
    data: {
      "article": {
        "title": "Test Article",
        "description": "Test Description",
        "body": "Test Body",
        "tagList": []
      }
    }
  })
  const articleJson = await createArticle.json()
  const slugId = articleJson.article.slug

  //Fetch articles without authentication 
  const getArticlesWithoutToken = await request.get(`${config.apiUrl}/articles?limit=10&offset=0`)
  const getArticlesWithoutTokenJSON = await getArticlesWithoutToken.json()

  expect(getArticlesWithoutTokenJSON.articlesCount).toEqual(10)

  //Fetch articles with authentication 
  const getArticlesWithToken = await request.get(`${config.apiUrl}/articles?limit=10&offset=0`, {
    headers: {
      Authorization: authToken
    }
  })
  const getArticlesWithTokenJson = await getArticlesWithToken.json()
  expect(getArticlesWithTokenJson.articlesCount).toEqual(11)

  //Delete the article
  const deleteArticle = await request.delete(`${config.apiUrl}/articles/${slugId}`, {
    headers: {Authorization: authToken}
  })
  expect(deleteArticle.status()).toEqual(204)
 

})
/*
📌 **Refactored Version Using a Helper Function**
Now, let's optimize the authentication logic by using a helper function.
 - ✅ The authentication logic is extracted into a reusable helper function.
 - ✅ The test remains the same, but the token is retrieved via `getToken()`.
 - ✅ This avoids code duplication and improves maintainability.
*/
test('fetch articles using helper function getToken', async ({ request }) => {
  // 🔹 Get authentication token from the helper function
  const authToken = await getToken();

   // 🔹 Create an article
   const createArticle = await request.post(`${config.apiUrl}/articles`, {
    headers: { Authorization: authToken},
    data: {
      "article": {
        "title": "Test Article",
        "description": "Test Description",
        "body": "Test Body",
        "tagList": []
      }
    }
   })
   const articleJson = await createArticle.json()
   const slugId = articleJson.article.slug
   // 🔹 Fetch articles without authentication
   const getArticlesWithoutToken = await request.get(`${config.apiUrl}/articles?limit=10&offset=0`)
   const getArticlesWithoutTokenJSON = await getArticlesWithoutToken.json()
   expect(getArticlesWithoutTokenJSON.articlesCount).toEqual(10)

   // 🔹 Fetch articles with authentication
    const getArticlesWithToken = await request.get(`${config.apiUrl}/articles?limit=10&offset=0`, {
      headers: {Authorization: authToken}
})
const getArticlesWithTokenJSON = await getArticlesWithToken.json()
expect(getArticlesWithTokenJSON.articlesCount).toEqual(11)

// 🔹 Delete the article
const deleteArticle = await request.delete(`${config.apiUrl}/articles/${slugId}`, {
  headers: {Authorization: authToken}
})
expect(deleteArticle.status()).toEqual(204)
})
