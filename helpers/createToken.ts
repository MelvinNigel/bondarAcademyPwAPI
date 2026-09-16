import { RequestHandler } from "../utils/request-handler";

export async function createToken(api: RequestHandler, email: string, password: string) {
    const tokenResponse = await api
        .path('/users/login')
        .body({ "user": { "email": email, "password": password } })
        .postRequest(200)
    return 'Token ' + tokenResponse.user.token;
}