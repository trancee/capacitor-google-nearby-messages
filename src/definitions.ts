import { PluginListenerHandle } from '@capacitor/core';

declare module "@capacitor/core" {
  interface PluginRegistry {
    GoogleNearbyMessages: GoogleNearbyMessagesPlugin;
  }
}

// A message that will be shared with nearby devices.
// https://developers.google.com/android/reference/com/google/android/gms/nearby/messages/Message
export interface Message {
  // The raw bytes content of the message.
  content: string;
  // The type that describes the content of the message.
  type: string;
  // The non-empty string for a public namespace or empty for the private one.
  namespace?: string;
}

// Describes a set of strategies for publishing or subscribing for nearby messages.
// https://developers.google.com/android/reference/com/google/android/gms/nearby/messages/Strategy
export interface Strategy {
  // The default strategy, which is suitable for most applications.
  DEFAULT?: boolean;
  // Use only Bluetooth Low Energy to discover nearby devices. Recommended if you are only interested in messages attached to BLE beacons.
  BLE_ONLY?: boolean;

  // Sets the desired discovery mode that determines how devices will detect each other.
  discoveryMode?: DiscoveryMode;
  // If used with a publish, the published message will only be delivered to subscribing devices that are at most the specified distance from this device.
  distanceType?: DistanceType;
  // Sets the time to live in seconds for the publish or subscribe.
  ttlSeconds?: TTLSeconds | number;
}

/*
// Callback for events which affect published messages.
// https://developers.google.com/android/reference/com/google/android/gms/nearby/messages/PublishCallback
export interface PublishCallback {
  // The published message is expired.
  onExpired: () => void;
}
*/

// Options for calls to publish(GoogleApiClient, Message).
// https://developers.google.com/android/reference/com/google/android/gms/nearby/messages/PublishOptions
export interface PublishOptions {
  // Sets the strategy for publishing.
  strategy?: Strategy;
  // Sets a callback which will be notified when significant events occur that affect this publish.
  // UNUSED // callback?: PublishCallback;
}

// Represents properties of the BLE signal associated with a Message.
// https://developers.google.com/android/reference/com/google/android/gms/nearby/messages/BleSignal
export interface BleSignal {
  // Returns the received signal strength indicator (RSSI) in dBm.
  // The valid range is [-127, 127], inclusive.
  rssi: number;
  // Returns the transmission power level at 1 meter, in dBm.
  // Returns UNKNOWN_TX_POWER if the advertiser did not report its transmission power.
  txPower: number;
}

// Represents the distance to a Message.
// https://developers.google.com/android/reference/com/google/android/gms/nearby/messages/Distance
export interface Distance {
  // The accuracy of the distance estimate.
  accuracy: number;
  // The distance estimate, in meters.
  meters: number;
}

// A listener for receiving subscribed messages.
// These callbacks will be delivered when messages are found or lost.
export interface MessageListener {
  // Called when the Bluetooth Low Energy (BLE) signal associated with a message changes.
  onBleSignalChanged: (message: Message, bleSignal: BleSignal) => void;
  // Called when Nearby's estimate of the distance to a message changes.
  onDistanceChanged: (message: Message, distance: Distance) => void;
  // Called when messages are found.
  onFound: (message: Message) => void;
  // Called when a message is no longer detectable nearby.
  onLost: (message: Message) => void;
}

// A message that will be sent directly over near-ultrasound audio.
// https://developers.google.com/android/reference/com/google/android/gms/nearby/messages/audio/AudioBytes
export interface AudioBytes {
  // Creates an AudioBytes object from a byte[] payload for use with the Nearby Messages API.
  audioData: string;
}

// The maximum size of the audio message payload.
// Only MAX_SIZE bytes will be sent over the audio medium.
// https://developers.google.com/android/reference/com/google/android/gms/nearby/messages/audio/AudioBytes#constant-summary
export const MAX_SIZE = 10;

export interface includeAudioBytes {
  // Number of bytes for the audio bytes message (capped by MAX_SIZE).
  numAudioBytes: number;
}
export interface includeEddystoneUids {
  // The 10-byte Eddystone UID namespace in hex format. For example, "a032ffed0532bca3846d".
  hexNamespace: string;
  // An optional 6-byte Eddystone UID instance in hex format. For example, "00aabbcc2233".
  hexInstance: string;
}
export interface includeIBeaconIds {
  // The proximity UUID.
  proximityUuid: string;
  // An optional major value.
  major?: number;
  // An optional minor value.
  minor?: number;
}
export interface includeNamespacedType {
  // The namespace that the message belongs to.
  // It must be non-empty and cannot contain the following invalid character: star(*).
  namespace: string;
  // The type of the message to include.
  // It must non-null and cannot contain the following invalid character: star(*).
  type: string;
}

// Used to specify the set of messages to be received.
// https://developers.google.com/android/reference/com/google/android/gms/nearby/messages/MessageFilter
export interface MessageFilter {
  // A convenient filter that returns all types of messages published by this application's project.
  INCLUDE_ALL_MY_TYPES?: boolean;

  // Filters for all messages published by this application (and any other applications in the same Google Developers Console project), regardless of type.
  includeAllMyTypes?: true | void;
  // Includes raw audio byte messages.
  // This can only be called once to set the number of audio bytes to be received.
  includeAudioBytes?: includeAudioBytes;
  // Includes Eddystone UIDs.
  includeEddystoneUids?: includeEddystoneUids;
  // Includes iBeacon IDs.
  includeIBeaconIds?: includeIBeaconIds;
  // Filters for all messages in the given namespace with the given type.
  includeNamespacedType?: includeNamespacedType;
  // Includes the previously constructed filter.
  // UNUSED // includeFilter?: MessageFilter;
}

/*
// Callback for events which affect subscriptions.
// https://developers.google.com/android/reference/com/google/android/gms/nearby/messages/SubscribeCallback
export interface SubscribeCallback {
  // The subscription is expired.
  onExpired: () => void;
}
*/

// Options for calls to subscribe(GoogleApiClient, PendingIntent).
// https://developers.google.com/android/reference/com/google/android/gms/nearby/messages/SubscribeOptions
export interface SubscribeOptions {
  // Sets a strategy for subscribing.
  strategy?: Strategy;
  // Sets a filter to specify which messages to receive.
  filter: MessageFilter;
  // Sets a callback which will be notified when significant events occur that affect this subscription.
  // UNUSED // callback?: SubscribeCallback;
}

/*
// Callbacks for global status changes that affect a client of Nearby Messages.
// https://developers.google.com/android/reference/com/google/android/gms/nearby/messages/StatusCallback
export interface StatusCallback {
  // Called when permission is granted or revoked for this app to use Nearby.
  onPermissionChanged: (permissionGranted: boolean) => void;
}
*/

export type InitializeResult = {
  // Restart the app after granting permission to re-initialize with background context (Android).
  restartApp?: boolean;
}
export type UUID = {
  uuid: string;
}
export type Status = {
  isPublishing: boolean;
  isSubscribing: boolean;
  uuids: string[];
}

// API which allows your app to publish simple messages and subscribe to receive those messages from nearby devices.
export interface GoogleNearbyMessagesPlugin {
  // Initializes the Nearby Messages API.
  initialize(options: {
    // The API key of the app, required to use the Messages service (iOS).
    apiKey?: string,
  }): Promise<InitializeResult>;
  // Resets the Nearby Messages API.
  // This will unsubscribe and unpublish all existing messages and emits onSubscribeExpired and onPublishExpired events.
  reset(): Promise<void>;

  // Publishes a message so that it is visible to nearby devices, using the default options from DEFAULT.
  publish(options: {
    // A Message to publish for nearby devices to see
    message: Message,
    // A PublishOptions object for this operation
    options?: PublishOptions,
  }): Promise<UUID>;

  // Cancels an existing published message.
  unpublish(options: {
    // A Message that is currently published
    // UNUSED // message: Message,
    uuid?: UUID,
  }): Promise<void>;

  // Subscribes for published messages from nearby devices, using the default options in DEFAULT.
  subscribe(options: {
    // A MessageListener implementation to get callbacks of received messages
    // UNUSED // listener: MessageListener,
    // A SubscribeOptions object for this operation
    options?: SubscribeOptions,
  }): Promise<void>;

  // Cancels an existing subscription.
  unsubscribe(options: {
    // A MessageListener implementation that is currently subscribed
    // UNUSED // listener: MessageListener,
  }): Promise<void>;

  /*
  // Registers a status callback, which will be notified when significant events occur that affect Nearby for your app.
  registerStatusCallback(options: {
    // A callback to notify when events occur
    // UNUSED // statusCallback: StatusCallback,
  }): Promise<void>;

  // Unregisters a status callback previously registered with registerStatusCallback(StatusCallback).
  unregisterStatusCallback(options: {
    // A callback previously registered with registerStatusCallback(StatusCallback)
    // UNUSED // statusCallback: StatusCallback,
  }): Promise<void>;
  */

  pause(): Promise<void>;
  resume(): Promise<void>;

  status(): Promise<Status>;

  // Called when permission is granted or revoked for this app to use Nearby.
  addListener(eventName: 'onPermissionChanged', listenerFunc: (permissionGranted: boolean) => void): PluginListenerHandle;

  // Called when the Bluetooth Low Energy (BLE) signal associated with a message changes.
  addListener(eventName: 'onBleSignalChanged', listenerFunc: (message: Message, bleSignal: BleSignal) => void): PluginListenerHandle;
  // Called when Nearby's estimate of the distance to a message changes.
  addListener(eventName: 'onDistanceChanged', listenerFunc: (message: Message, distance: Distance) => void): PluginListenerHandle;
  // Called when messages are found.
  addListener(eventName: 'onFound', listenerFunc: (message: Message) => void): PluginListenerHandle;
  // Called when a message is no longer detectable nearby.
  addListener(eventName: 'onLost', listenerFunc: (message: Message) => void): PluginListenerHandle;

  // The published message is expired.
  addListener(eventName: 'onPublishExpired', listenerFunc: (uuid: UUID) => void): PluginListenerHandle;
  // The subscription is expired.
  addListener(eventName: 'onSubscribeExpired', listenerFunc: (uuid: UUID) => void): PluginListenerHandle;
}

// https://developers.google.com/android/reference/com/google/android/gms/nearby/messages/Message#constant-summary
// The maximum content size in number of bytes.
export const MAX_CONTENT_SIZE_BYTES = 102400;
// The maximum length() for the message type.
export const MAX_TYPE_LENGTH = 32;

// https://developers.google.com/android/reference/com/google/android/gms/nearby/messages/Message#constant-summary
// A namespace reserved for special Messages.
export const MESSAGE_NAMESPACE_RESERVED = "__reserved_namespace";
// Message type refers to an AudioBytes based message which contains raw byte[] data to be directly sent or received over the near-ultrasound audio medium.
export const MESSAGE_TYPE_AUDIO_BYTES = "__audio_bytes";
// See includeEddystoneUids(String, String) and from(Message).
export const MESSAGE_TYPE_EDDYSTONE_UID = "__eddystone_uid";
// See includeIBeaconIds(UUID, Short, Short) and from(Message).
export const MESSAGE_TYPE_I_BEACON_ID = "__i_beacon_id";

// https://developers.google.com/android/reference/com/google/android/gms/nearby/messages/Strategy#constant-summary
export enum DiscoveryMode {
  // To discover which devices are nearby, broadcast a pairing code for others to scan.
  DISCOVERY_MODE_BROADCAST = 1,
  // To discover which devices are nearby, scan for other devices' pairing codes.
  DISCOVERY_MODE_SCAN = 2,
  // To discover which devices are nearby, broadcast a pairing code and scan for other devices' pairing codes.
  // This is equivalent to DISCOVERY_MODE_BROADCAST | DISCOVERY_MODE_SCAN.
  DISCOVERY_MODE_DEFAULT = 3,
}

// https://developers.google.com/android/reference/com/google/android/gms/nearby/messages/Strategy#constant-summary
export enum DistanceType {
  // Allows the message be exchanged over any distance.
  DISTANCE_TYPE_DEFAULT = 0,
  // Allows the message be exchanged within earshot only.
  // It is recommended that this configuration is used in conjunction with DISCOVERY_MODE_BROADCAST.
  // This will improve the detection latency.
  DISTANCE_TYPE_EARSHOT = 1,
}

// https://developers.google.com/android/reference/com/google/android/gms/nearby/messages/Strategy#constant-summary
export enum TTLSeconds {
  // The default time to live in seconds.
  TTL_SECONDS_DEFAULT = 300,
  // The maximum time to live in seconds, if not TTL_SECONDS_INFINITE.
  TTL_SECONDS_MAX = 86400,
  // An infinite time to live in seconds.
  // Note: This is currently only supported for subscriptions.
  TTL_SECONDS_INFINITE = 2147483647,
}

// Unknown transmission power level.
// https://developers.google.com/android/reference/com/google/android/gms/nearby/messages/BleSignal#constant-summary
export const UNKNOWN_TX_POWER = -2147483648;

// Nearby.Messages specific status codes, for use in getStatusCode().
// https://developers.google.com/android/reference/com/google/android/gms/nearby/messages/NearbyMessagesStatusCodes#constant-summary
export enum NearbyMessagesStatusCodes {
  // The app has issued more than 5 PendingIntent to the Messages#subscribe.
  // Some requests need to be removed before adding more.
  TOO_MANY_PENDING_INTENTS = 2801,
  // Status code indicating that the User has not granted the calling application permission to use Nearby.Messages.
  APP_NOT_OPTED_IN = 2802,
  // The app is issuing an operation using a GoogleApiClient bound to an inappropriate Context;
  // see the relevant method's documentation (for example, publish(GoogleApiClient, Message, PublishOptions)) to see its list of allowed Contexts.
  DISALLOWED_CALLING_CONTEXT = 2803,
  // The app has reached its quota limit to use Nearby Messages API.
  // Use the Quota request form for the Nearby Messages API in your project's developer console to request more quota.
  APP_QUOTA_LIMIT_REACHED = 2804,
  NOT_AUTHORIZED = 2805,
  // The request could not be completed because it was disallowed.
  // The issue is not resolvable by the client, and the request should not be retried.
  FORBIDDEN = 2806,
  // The request could not be completed because it was disallowed.
  // Check the error message to see what permission is missing and make sure the right NearbyPermissions is specified for setPermissions(int).
  MISSING_PERMISSIONS = 2807,

  // Bluetooth is currently off.
  BLUETOOTH_OFF = 2820,
  // The client requested an operation that requires Bluetooth Low Energy advertising (such as publishing with BLE_ONLY), but this feature is not supported.
  BLE_ADVERTISING_UNSUPPORTED = 2821,
  // The client requested an operation that requires Bluetooth Low Energy scanning (such as subscribing with BLE_ONLY), but this feature is not supported.
  BLE_SCANNING_UNSUPPORTED = 2822,
}

// Determines the scope of permissions Nearby will ask for at connection time.
// https://developers.google.com/android/reference/com/google/android/gms/nearby/messages/NearbyPermissions#constant-summary
export enum NearbyPermissions {
  DEFAULT = -1,
  NONE = 0,
  MICROPHONE = 1,
  BLE = 2,
  BLUETOOTH = 6,
}
