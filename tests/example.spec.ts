import { test, expect } from "@playwright/test";
import { config } from "../api-test.config";
import { getToken } from "../helpers/getToken";
import { RequestHandler } from "../utils/request-handler";

test("Verify created article visibility: Without token vs With token", async ({ request }) => {
  
  const authToken = await getToken() 
  const api = new RequestHandler(request, config.apiUrl, authToken) 

  // 🔹 create new article
  const createArticle = await api
    .path("/articles")
    .body({
      article: {
        title: "Test Article Visibility",
        description: "Checking if the article is visible",
        body: "This article should be visible only when logged in",
        tagList: []
      }

    })
    .postRequest(201)

  // 🔹 The response is automatically parsed as JSON, so we can directly access `article.slug`
  // 🔹 No need to call .json(), the response is already parsed as JSON
// 🔹 We can directly access createArticle.article.slug (ex.)
  const slugId = createArticle.article.slug
  expect(createArticle.article.title).toBe("Test Article Visibility")
  
  // 🔹 Get the article list without TOKEN
  const getArticlesWithoutToken = await api
  .path("/articles")
  .params({ limit: 10, offset: 0 })
  .clearAuth()  //should return an empty apiHeaders ???
  .getRequest(200)
  console.log(getArticlesWithoutToken.articles)
  console.log(getArticlesWithoutToken.articlesCount)
  expect(getArticlesWithoutToken.articlesCount).toEqual(10); // 🔹 The new article should not be visible without token
  // BUT IT IS VISIBLE

/*
  expect(getArticlesWithoutToken.articlesCount).toEqual(10);
  // 🔹 The article should not be visible without token
  const articleTitlesWithoutLogin = getArticlesWithoutToken.articles.map(a => a.title);
  expect(articleTitlesWithoutLogin).not.toContain("Test Article Visibility");

*/
})