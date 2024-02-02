export default async (event: any) => {
    const req = event?.node?.req;
    const xForwardedFor = getRequestHeader(event, "x-forwarded-for")?.split(",")?.pop()?.trim() || "";
    const remoteAddress = req?.socket?.remoteAddress || "";
    let ip = xForwardedFor || remoteAddress;
    if (ip) {
        ip = ip.split(":")[0];
    }
    return ip;
}