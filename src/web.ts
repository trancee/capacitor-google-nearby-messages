import { WebPlugin } from '@capacitor/core';
import { GoogleNearbyMessagesPlugin } from './definitions';

import {
  Message,
  PublishOptions,
  SubscribeOptions,
  InitializeResult,
  UUID,
  Status,
} from './definitions';

export class GoogleNearbyMessagesWeb extends WebPlugin implements GoogleNearbyMessagesPlugin {
  constructor() {
    super({
      name: 'GoogleNearbyMessages',
      platforms: ['web'],
    });
  }

  async initialize(options: {
    // The API key of the app, required to use the Messages service (iOS).
    apiKey?: string,
    // Enable debug logging to help track down problems (iOS).
    debug?: boolean,
  }): Promise<InitializeResult> {
    console.log("initialize", options);
    throw new Error("Method not implemented.");
  }
  async reset(): Promise<void> {
    console.log("reset");
    throw new Error("Method not implemented.");
  }

  // Publishes a message so that it is visible to nearby devices, using the default options from DEFAULT.
  async publish(options: {
    // A Message to publish for nearby devices to see
    message: Message,
    // A PublishOptions object for this operation
    options?: PublishOptions,
  }): Promise<UUID> {
    console.log("publish", options);
    throw new Error("Method not implemented.");
  }

  // Cancels an existing published message.
  async unpublish(options: {
    // A Message that is currently published
    // UNUSED // message: Message,
    uuid?: UUID,
  }): Promise<void> {
    console.log("unpublish", options);
    throw new Error("Method not implemented.");
  }

  // Subscribes for published messages from nearby devices, using the default options in DEFAULT.
  async subscribe(options: {
    // A SubscribeOptions object for this operation
    options?: SubscribeOptions,
  }): Promise<void> {
    console.log("subscribe", options);
    throw new Error("Method not implemented.");
  }

  // Cancels an existing subscription.
  async unsubscribe(options: {
  }): Promise<void> {
    console.log("unsubscribe", options);
    throw new Error("Method not implemented.");
  }

  async pause(): Promise<void> {
    console.log("pause");
    throw new Error("Method not implemented.");
  }
  async resume(): Promise<void> {
    console.log("resume");
    throw new Error("Method not implemented.");
  }

  async status(): Promise<Status> {
    console.log("status");
    throw new Error("Method not implemented.");
  }
}

const GoogleNearbyMessages = new GoogleNearbyMessagesWeb();

export { GoogleNearbyMessages };

import { registerWebPlugin } from '@capacitor/core';
registerWebPlugin(GoogleNearbyMessages);
