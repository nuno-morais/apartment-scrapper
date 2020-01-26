import 'dotenv/config';
import * as request from 'request';

const options = {
    form: {
        audience: process.env.TEST_AUTH_AUDIENCE,
        client_id: process.env.TEST_AUTH_CLIENT_ID,
        client_secret: process.env.TEST_AUTH_CLIENT_SECRET,
        grant_type: 'client_credentials',
    },
    headers: { 'content-type': 'application/x-www-form-urlencoded' },
    method: 'POST',
    url: process.env.TEST_AUTH_URL,
};

export const getToken = (): Promise<{ access_token: string, token_type: string, expires_in: number }> =>
    new Promise((resolve, reject) => {
        request(options, (error, _, body) => {
            if (error) { reject(error); }
            resolve(JSON.parse(body));
        });
    });
