import { createToken } from '../helpers/createToken';
import { expect } from '../utils/custom-expect';
import { test } from '../utils/fixtures';

let authToken = '';
test.beforeAll('Get Token', async ({ api, config }) => {
    // const tokenResponse = await api
    //     .path('/users/login')
    //     .body({ "user": { "email": config.userEmail, "password": config.userPassword } })
    //     .postRequest(200)

    authToken = await createToken(api, config.userEmail, config.userPassword)
    // console.log(tokenResponse.user)
})

// test('logger', () => {
//     const logger = new APILogger
//     const logger2 = new APILogger
//     logger.logRequest('POST', 'http://test.com/api', { Authorization: 'token' }, { foo: 'bar' })
//     logger.logResponse(200, { foo: 'bar' })
//     logger2.logRequest('GET', 'http://test.com/api123', { Authorization: 'token' }, { foo: 'bar' })
//     logger2.logResponse(200, { foo: 'bar' })
//     const logs = logger.getRecentLogs()
//     const logs2 = logger2.getRecentLogs()
//     console.log(logs)
//     console.log(logs2)
// })
test('Get Articles', async ({ api }) => {

    const response = await api // await is necessary because "getRequest" is an async function that returns a promise
        // .url('')
        .path('/articles')
        .params({ limit: 10, offset: 0 })
        .headers({ Authorization: authToken })
        .getRequest(200)

    // console.log(response)
    expect(response.articlesCount).toBeGreaterThanOrEqual(10);
    expect(response.articlesCount).not.shouldEqual(9)

})

test('Get test tags', async ({ api }) => {

    const response = await api
        .path('/tags')
        .getRequest(200)

    // console.log(response)
    expect(response.tags[0]).toEqual('Test');
    expect(response.tags.length).toBeLessThanOrEqual(10);
})


test('Create and Delete article', async ({ api }) => {
    const newArticleResponse = await api
        .path('/articles')
        .headers({ Authorization: authToken })
        .body(
            {
                "article": {
                    "title": "first test",
                    "description": "first test description",
                    "body": "first test body",
                    "tagList": []
                }
            })
        .postRequest(201)
    const slugId = newArticleResponse.article.slug;
    expect(newArticleResponse.article.title).toEqual('first test');


    const getArticleResponse = await api
        .path('/articles')
        .headers({ Authorization: authToken })
        .params({ limit: 10, offset: 0 })
        .getRequest(200)

    // console.log(getArticleResponse.articles[0]);

    expect(getArticleResponse.articles[0].title).toEqual('first test')

    await api
        .path('/articles/' + slugId)
        .headers({ Authorization: authToken })
        .deleteRequest(204)

    const getArticleResponseAfterDelete = await api
        .path('/articles')
        .headers({ Authorization: authToken })
        .params({ limit: 10, offset: 0 })
        .getRequest(200)

    expect(getArticleResponseAfterDelete.articles[0].title).not.toEqual('first test');

})

test('Create, Update and Delete article', async ({ api }) => {
    const createArticleResponse = await api
        .path('/articles')
        .headers({ Authorization: authToken })
        .body({
            "article": {
                "title": "first test",
                "description": "first test description",
                "body": "first test body",
                "tagList": []
            }
        })
        .postRequest(201)

    expect(createArticleResponse.article.title).toEqual('first test');
    const slugId = createArticleResponse.article.slug;
    console.log("slug ID" + slugId);

    const updateArticleResponse = await api
        .path('/articles/' + slugId)
        .headers({ Authorization: authToken })
        .body({
            "article": {
                "title": "first test MODIFIED",
                "description": "first test description MODIFIED",
                "body": "first test body MODIFIED",
                "tagList": []
            }
        })
        .putRequest(200)

    expect(updateArticleResponse.article.title).toEqual('first test MODIFIED');
    expect(updateArticleResponse.article.description).toEqual('first test description MODIFIED');
    expect(updateArticleResponse.article.body).toEqual('first test body MODIFIED');
    const newSlugId = updateArticleResponse.article.slug
    console.log("NEW slug ID" + newSlugId);

    const getArticleResponse = await api
        .path('/articles')
        .headers({ Authorization: authToken })
        .params({ limit: 10, offset: 0 })
        .getRequest(200)

    expect(getArticleResponse.articles[0].title).toEqual('first test MODIFIED')

    await api
        .path('/articles/' + newSlugId)
        .headers({ Authorization: authToken })
        .deleteRequest(204)

    const getArticleResponseAfterDelete = await api
        .path('/articles')
        .headers({ Authorization: authToken })
        .params({ limit: 10, offset: 0 })
        .getRequest(200)
    // console.log(getArticleResponseAfterDelete.articles[0]);
    expect(getArticleResponseAfterDelete.articles[0].title).not.toEqual('first test MODIFIED');

})
