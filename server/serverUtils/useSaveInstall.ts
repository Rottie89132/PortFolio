
export default async (Action: any, user: any, OctoKitData: any) => {
    const { token, instalId, createdAt, expiresAt } = OctoKitData
    const GitTokenExist: Record<string, any> | null = await GitUser.findOne({ UserID: user.Id });

    if (!GitTokenExist && Action === "Create") {
        const encryptedToken = useEncryptValue(token);
        await GitUser.create({ 
            UserID: user.Id, 
            AccessToken: encryptedToken,
            installationId: instalId,
            createdAt: createdAt,
            expiresAt: expiresAt
        });
    } else if (Action === "Update"){
        const encryptedToken = useEncryptValue(token);
        await GitUser.findOneAndUpdate({ UserID: user.Id }, {
            $set: {
                AccessToken: encryptedToken,
                createdAt: createdAt,
                expiresAt: expiresAt
            }
        })
    } 
}

