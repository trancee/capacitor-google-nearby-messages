import { WebPlugin } from '@capacitor/core';
import { GoogleNearbyMessagesPlugin } from './definitions';
import { Message, PublishOptions, SubscribeOptions, Task } from './definitions';
export declare class GoogleNearbyMessagesWeb extends WebPlugin implements GoogleNearbyMessagesPlugin {
    constructor();
    publish(options: {
        message: Message;
        options?: PublishOptions;
    }): Promise<Task>;
    unpublish(options: {}): Promise<Task>;
    subscribe(options: {
        options?: SubscribeOptions;
    }): Promise<Task>;
    unsubscribe(options: {}): Promise<Task>;
    registerStatusCallback(options: {}): Promise<Task>;
    unregisterStatusCallback(options: {}): Promise<Task>;
    pause(): Promise<void>;
    resume(): Promise<void>;
    status(): Promise<void>;
}
declare const GoogleNearbyMessages: GoogleNearbyMessagesWeb;
export { GoogleNearbyMessages };
