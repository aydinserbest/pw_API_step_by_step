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
  
      console.log("After postrequest:", api["apiHeaders"]);
      console.log("After postrequest:", api["defaultAuthToken"]);

    
    // 🔹 Get the article list without TOKEN
    const getArticlesWithoutToken = await api
    .path("/articles")
    .params({ limit: 10, offset: 0 })
    .clearAuth()  //should return an empty apiHeaders 
    .getRequest(200)
    console.log(getArticlesWithoutToken.articles.apiHeaders)

    console.log("After getrequest:", api["apiHeaders"]);
    console.log("After postrequest:", api["defaultAuthToken"]);


  
  
  
   
    
  
  })