import Pusher from 'pusher-js';
let pusher: any = null;
let channel: any = null;
let Countstate: Boolean = false;

export default defineNuxtPlugin(() => {
    const config = useRuntimeConfig()

    return {
        provide: {
            PusherOnStart: () => {
                if (pusher) return;
                pusher = new Pusher(config.public.PusherAppKey, { cluster: config.public.cluster });
                channel = pusher.subscribe(config.public.PusherChannel);

                channel.bind('pusher:subscription_succeeded', function() {
                    console.log(`Pusher connection established`);
                    Countstate = true;
                });

                pusher.connection.bind('state_change', function(states: any) {
                    if (states.current === 'disconnected') {
                        console.log("Pusher connection closed");
                        Countstate = false;
                    }
                });
            },
            PusherOnEvent: (EventValue: any, Reactive: any) => {
                channel.bind(EventValue, function(data: any) {
                    console.log("Pusher event received! ");
                    setTimeout(() => Reactive.value = data.actionID, 1000);
                });
            },
        }
    }
})