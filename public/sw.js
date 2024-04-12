import { clientsClaim } from "workbox-core";
import { precacheAndRoute, cleanupOutdatedCaches } from "workbox-precaching";
import { registerRoute } from 'workbox-routing';
import { NetworkFirst } from 'workbox-strategies';

self.skipWaiting();
clientsClaim();
precacheAndRoute(self.__WB_MANIFEST);
cleanupOutdatedCaches();

registerRoute(
    ({ url }) => {
        const pathSegments = url.pathname.split('/');
        return pathSegments.length === 4 && pathSegments[1] === 'api' && pathSegments[2] === 'repo' && /^\d+$/.test(pathSegments[3]) && url.search === '';
    },
    new NetworkFirst({
        cacheName: 'api-cache',
        plugins: [
            {
                cacheableResponse: {
                    statuses: [0, 200],
                }
            }
        ]
    })
);

registerRoute(
    ({ url }) => {
        const pathSegments = url.pathname.split('/');
        return pathSegments.length === 3 && pathSegments[1] === 'api' && pathSegments[2] === 'users' && url.search === '';
    },
    new NetworkFirst({
        cacheName: 'users-api-cache',
        plugins: [
            {
                cacheableResponse: {
                    statuses: [0, 200, 400],
                }
            }
        ]
    })
);



