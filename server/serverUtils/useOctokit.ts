import { createAppAuth } from "@octokit/auth-app";

export default async (InstallID: any,) => {
    const config = useRuntimeConfig()
    
    const appId = config.appId;
    const privateKey = config.privateKey;
    const clientId = config.clientId;
    const clientSecret = config.clientSecret;

    const auth = createAppAuth({
        appId: appId,
        privateKey: privateKey,
        clientId: clientId,
        clientSecret: clientSecret,
    });

    const installationId = [InstallID]
    const installationApp: any = await auth({ type: 'installation', installationId } as any);

    const token = installationApp.token;
    const instalId = installationApp.installationId;
    const createdAt = installationApp.createdAt;
    const expiresAt = installationApp.expiresAt;

    return {
        token: token,
        instalId: instalId,
        createdAt: createdAt,
        expiresAt: expiresAt
    }
}







