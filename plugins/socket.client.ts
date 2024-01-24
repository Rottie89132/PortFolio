import { io } from "socket.io-client";
let socket: any = null;
let Countstate: Boolean = false;

export default defineNuxtPlugin(() => {
    const config = useRuntimeConfig()

    return {
        provide: {
            StartSocket: () => {
                if (socket) return;
                socket = io(`:3500`);

                socket.on("connect", () => {
                    console.log(`websocket connection established`);
                    Countstate = true;
                });

                socket.on("disconnect", () => {
                    console.log("websocket connection closed");
                    Countstate = false;
                });
            },
            Socket: (EventValue: any, Reactive: any) => {
                socket.on(EventValue, async (event: any) => {
                    
                    console.log("Websocket event received! ");
                    setTimeout(async () => Reactive.value = event.actionID, 1000);
                    
                });
            },
        }
    }
})
