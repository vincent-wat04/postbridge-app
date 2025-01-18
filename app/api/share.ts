// app/api/share.ts
import { NextApiRequest, NextApiResponse } from 'next';
import { generateNonce, generateSignature, getAccessToken } from '../../utils/shareUtils';

let cachedAccessToken: string | null = null;
let cachedExpiresAt: number | null = null;
let cachedNonce: string | null = null;
let cachedTimestamp: number | null = null;

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'GET') {
        try {
            // examine if the cached access token is still valid
            if (cachedAccessToken && cachedExpiresAt && cachedExpiresAt > Date.now()) {
                const nonce = generateNonce();
                const timestamp = Date.now();
                const signature = generateSignature(nonce, timestamp, cachedAccessToken);

                res.status(200).json({
                    appKey: process.env.APP_KEY,
                    nonce,
                    timestamp,
                    signature,
                });
            } else {
                // get new access_token
                const { accessToken, expiresIn, nonce, timestamp } = await getAccessToken();
                cachedAccessToken = accessToken;
                cachedExpiresAt = Date.now() + expiresIn * 1000; // convert to milliseconds
                const signature = generateSignature(nonce, timestamp, cachedAccessToken);

                res.status(200).json({
                    appKey: process.env.APP_KEY,
                    nonce: cachedNonce,
                    timestamp: cachedTimestamp,
                    signature,
                });
            }
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    } else {
        res.setHeader('Allow', ['GET']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}