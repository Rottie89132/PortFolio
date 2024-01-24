import crypto from 'crypto';
const config = useRuntimeConfig()

export default (accessToken: string) => {
    const key = config.SaltToken;
    const cipher = crypto.createCipheriv('aes-256-cbc', key, Buffer.alloc(16));
    let encrypted = cipher.update(accessToken, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    return encrypted;
};