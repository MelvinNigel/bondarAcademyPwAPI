const processENV = process.env.TEST_ENV
const env = processENV || 'prod'
console.log('Test Environment is :' + env)

const config = {
    apiUrl: 'https://conduit-api.bondaracademy.com/api',
    userEmail: 'bullhoax@gmail.com',
    userPassword: 'bullhoax'
}

if (env === 'qa') {
    config.userEmail = 'diffEnvironment@test.com',
        config.userPassword = 'diffEnvironment'
}
else if (env === 'prod') {
    config.userEmail = 'bullhoax@gmail.com',
        config.userPassword = 'bullhoax'
}
//to run in terminal (every terminal)
//npx cross-env TEST_ENV=qa npx playwright test smokeTest.spec.ts

//to run in terminal (cmd)
//set TEST_ENV=qa && npx playwright test smokeTest.spec.ts

export { config }