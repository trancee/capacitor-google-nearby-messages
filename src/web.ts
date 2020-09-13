import { WebPlugin } from '@capacitor/core';
import { GoogleNearbyMessagesPlugin } from './definitions';

import {
  Message,
  // UNUSED // MessageListener,
  PublishOptions,
  SubscribeOptions,
  // UNUSED // StatusCallback,
  InitializeResult,
  UUID,
  Status,
} from './definitions';

export class GoogleNearbyMessagesWeb extends WebPlugin implements GoogleNearbyMessagesPlugin {
  constructor() {
    super({
      name: 'GoogleNearbyMessages',
      platforms: ['web']
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
    // A MessageListener implementation to get callbacks of received messages
    // UNUSED // listener: MessageListener,
    // A SubscribeOptions object for this operation
    options?: SubscribeOptions,
  }): Promise<void> {
    console.log("subscribe", options);
    throw new Error("Method not implemented.");
  }

  // Cancels an existing subscription.
  async unsubscribe(options: {
    // A MessageListener implementation that is currently subscribed
    // UNUSED // listener: MessageListener,
  }): Promise<void> {
    console.log("unsubscribe", options);
    throw new Error("Method not implemented.");
  }

  /*
  // Registers a status callback, which will be notified when significant events occur that affect Nearby for your app.
  async registerStatusCallback(options: {
    // A callback to notify when events occur
    // UNUSED // statusCallback: StatusCallback,
  }): Promise<void> {
    console.log("registerStatusCallback", options);
    throw new Error("Method not implemented.");
  }

  // Unregisters a status callback previously registered with registerStatusCallback(StatusCallback).
  async unregisterStatusCallback(options: {
    // A callback previously registered with registerStatusCallback(StatusCallback)
    // UNUSED // statusCallback: StatusCallback,
  }): Promise<void> {
    console.log("unregisterStatusCallback", options);
    throw new Error("Method not implemented.");
  }
  */

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
