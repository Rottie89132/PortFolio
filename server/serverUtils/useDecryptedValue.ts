import crypto from 'crypto';
const config = useRuntimeConfig()

export default (encryptedAccessToken: string) => {
    const key = config.SaltToken;
    const decipher = crypto.createDecipheriv('aes-256-cbc', key, Buffer.alloc(16));
    let decrypted = decipher.update(encryptedAccessToken, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    return decrypted;
};