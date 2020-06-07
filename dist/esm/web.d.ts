import { WebPlugin } from '@capacitor/core';
import { GoogleNearbyMessagesPlugin } from './definitions';
import { Message, PublishOptions, SubscribeOptions } from './definitions';
export declare class GoogleNearbyMessagesWeb extends WebPlugin implements GoogleNearbyMessagesPlugin {
    constructor();
    initialize(): Promise<void>;
    publish(options: {
        message: Message;
        options?: PublishOptions;
    }): Promise<void>;
    unpublish(options: {}): Promise<void>;
    subscribe(options: {
        options?: SubscribeOptions;
    }): Promise<void>;
    unsubscribe(options: {}): Promise<void>;
    pause(): Promise<void>;
    resume(): Promise<void>;
    status(): Promise<void>;
}
declare const GoogleNearbyMessages: GoogleNearbyMessagesWeb;
export { GoogleNearbyMessages };
