import { test as base } from '@playwright/test';
import { RequestHandler } from '../utils/request-handler';
import { APILogger } from './logger';
import { setCustomExpectLogger } from './custom-expect';
import { config } from '../api-test.config'

export type TestOptions = {
    api: RequestHandler
    config: typeof config
}

export const test = base.extend<TestOptions>({
    api: async ({ request }, use) => {
        const baseUrl = config.apiUrl
        const logger = new APILogger()
        setCustomExpectLogger(logger)
        const requestHandler = new RequestHandler(request, baseUrl, logger)
        //all code that you put before the line of code with a use method will be executed as a precondition
        await use(requestHandler)
        //all code that you put after the line of code with a use method will be executed as a postcondition
    },
    config: async ({ }, use) => {
        await use(config)
    }
})