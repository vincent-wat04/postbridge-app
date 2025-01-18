// utils/shareUtils.ts
import crypto from 'crypto';
import axios from 'axios';

export const generateNonce = () => crypto.randomBytes(16).toString('hex').substring(0, 32);

// the param secret might be the app secret or the access token, depending on the calling context
export const generateSignature = (nonce: string, timestamp: number, secret: string) => {
    const params = `${process.env.APP_KEY}&${nonce}&${timestamp}&${secret}`;
    return crypto.createHash('sha256').update(params).digest('hex');
};

export const getAccessToken = async (): Promise<{ accessToken: string; expiresIn: number; nonce: string; timestamp: number }> => {
    const appKey: string = process.env.APP_KEY || '';
    const appSecret: string = process.env.APP_SECRET || '';
    const nonce = generateNonce();
    const timestamp = Date.now();
    const signature = generateSignature(nonce, timestamp, appSecret);

    const response = await axios.post('https://edith.xiaohongshu.com/api/sns/v1/ext/access/token', {
        app_key: appKey,
        nonce,
        timestamp,
        signature,
    }, {
        headers: {
        'Content-Type': 'application/json'
        }
    });

    return {
        accessToken: response.data.access_token,
        expiresIn: response.data.expires_in,
        nonce,
        timestamp,
    };
};


