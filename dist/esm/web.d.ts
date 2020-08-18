import { WebPlugin } from '@capacitor/core';
import { GoogleNearbyMessagesPlugin } from './definitions';
import { Message, PublishOptions, SubscribeOptions, InitializeResult, UUID, Status } from './definitions';
export declare class GoogleNearbyMessagesWeb extends WebPlugin implements GoogleNearbyMessagesPlugin {
    constructor();
    initialize(options: {
        apiKey?: string;
    }): Promise<InitializeResult>;
    reset(): Promise<void>;
    publish(options: {
        message: Message;
        options?: PublishOptions;
    }): Promise<UUID>;
    unpublish(options: {
        uuid?: UUID;
    }): Promise<void>;
    subscribe(options: {
        options?: SubscribeOptions;
    }): Promise<void>;
    unsubscribe(options: {}): Promise<void>;
    pause(): Promise<void>;
    resume(): Promise<void>;
    status(): Promise<Status>;
}
declare const GoogleNearbyMessages: GoogleNearbyMessagesWeb;
export { GoogleNearbyMessages };
