import { test, expect, request } from '@playwright/test';

let authToken: string;

test.beforeAll('run once before all test', async ({ request }) => {
  const tokenResponse = await request.post('https://conduit-api.bondaracademy.com/api/users/login', {
    data: { "user": { "email": "bullhoax@gmail.com", "password": "bullhoax" } }
  });

  const tokenResponseJSON = await tokenResponse.json();
  authToken = 'Token ' + tokenResponseJSON.user.token;
})

test('Get Test Tags @smoke', async ({ request }) => {

  const tagsResponse = await request.get('https://conduit-api.bondaracademy.com/api/tags');
  const tagsResponseJSON = await tagsResponse.json();

  //assertation
  expect(tagsResponse.status()).toEqual(200);
  expect(tagsResponseJSON.tags[0]).toEqual('Test');
  expect(tagsResponseJSON.tags.length).toBeLessThanOrEqual(10);
});


test('Get All Articles @smoke', async ({ request }) => {

  const articlesResponse = await request.get('https://conduit-api.bondaracademy.com/api/articles?limit=10&offset=0');
  const articlesResponseJSON = await articlesResponse.json();

  expect(articlesResponse.status()).toEqual(200);
  expect(articlesResponseJSON.articles.length).toBeLessThanOrEqual(10);
  expect(articlesResponseJSON.articlesCount).toEqual(10);
});

test('Create  and Delete article', async ({ request }) => {
  const newArticleResponse = await request.post('https://conduit-api.bondaracademy.com/api/articles/', {
    data: {
      "article": {
        "title": "test6",
        "description": "test desc3",
        "body": "test3",
        "tagList": []
      }
    },
    headers: {
      Authorization: authToken
    }
  })

  const newArticleResponseJSON = await newArticleResponse.json();
  const slugId = newArticleResponseJSON.article.slug;
  // console.log(newArticleResponseJSON);
  expect(newArticleResponse.status()).toEqual(201);
  expect(newArticleResponseJSON.article.title).toEqual('test6');

  const articlesResponse = await request.get('https://conduit-api.bondaracademy.com/api/articles?limit=10&offset=0', {
    headers: {
      Authorization: authToken
    }
  });
  const articlesResponseJSON = await articlesResponse.json();
  // console.log(articlesResponseJSON);
  expect(articlesResponseJSON.articles[0].title).toEqual('test6');

  const deleteArticleResponse = await request.delete('https://conduit-api.bondaracademy.com/api/articles/' + slugId, {
    headers: {
      Authorization: authToken
    }
  })

  expect(deleteArticleResponse.status()).toEqual(204);
})

test('Create Update and Delete article', async ({ request }) => {
  const newArticleResponse = await request.post('https://conduit-api.bondaracademy.com/api/articles/', {
    data: {
      "article": {
        "title": "test",
        "description": "test desc",
        "body": "test",
        "tagList": []
      }
    },
    headers: {
      Authorization: authToken
    }
  })

  const newArticleResponseJSON = await newArticleResponse.json();
  const slugId = newArticleResponseJSON.article.slug;
  // console.log(newArticleResponseJSON);
  expect(newArticleResponse.status()).toEqual(201);
  expect(newArticleResponseJSON.article.title).toEqual('test');

  const articlesResponse = await request.get('https://conduit-api.bondaracademy.com/api/articles?limit=10&offset=0', {
    headers: {
      Authorization: authToken
    }
  });
  const articlesResponseJSON = await articlesResponse.json();
  // console.log(articlesResponseJSON);
  expect(articlesResponseJSON.articles[0].title).toEqual('test');

  const updateArticleResponse = await request.put('https://conduit-api.bondaracademy.com/api/articles/' + slugId, {
    headers: {
      Authorization: authToken
    },
    data: {
      "article": {
        "title": "test2",
        "description": "test desc2",
        "body": "test2",
        "tagList": []
      }
    }
  })
  const updateArticleResponseJSON = await updateArticleResponse.json();
  const newSlugId = updateArticleResponseJSON.article.slug;
  expect(updateArticleResponse.status()).toEqual(200);
  expect(updateArticleResponseJSON.article.title).toEqual('test2');



  const deleteArticleResponse = await request.delete('https://conduit-api.bondaracademy.com/api/articles/' + newSlugId, {
    headers: {
      Authorization: authToken
    }
  })

  expect(deleteArticleResponse.status()).toEqual(204);
})