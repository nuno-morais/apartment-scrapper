import * as request from 'request';
import 'dotenv/config';

const options = {
    method: 'POST',
    url: process.env.TEST_AUTH_URL,
    headers: { 'content-type': 'application/x-www-form-urlencoded' },
    form: {
        grant_type: 'client_credentials',
        client_id: process.env.TEST_AUTH_CLIENT_ID,
        client_secret: process.env.TEST_AUTH_CLIENT_SECRET,
        audience: process.env.TEST_AUTH_AUDIENCE,
    },
};

export const getToken = (): Promise<{ access_token: string, token_type: string, expires_in: number }> =>
    new Promise((resolve, reject) => {
        request(options, (error, _, body) => {
            if (error) { reject(error); }
            resolve(JSON.parse(body));
        });
    });
