import { PluginListenerHandle } from '@capacitor/core';
declare module "@capacitor/core" {
    interface PluginRegistry {
        GoogleNearbyMessages: GoogleNearbyMessagesPlugin;
    }
}
export interface Message {
    content: string;
    type: string;
    namespace?: string;
}
export interface Strategy {
    DEFAULT?: boolean;
    BLE_ONLY?: boolean;
    discoveryMode?: DiscoveryMode;
    distanceType?: DistanceType;
    ttlSeconds?: TTLSeconds | number;
}
export interface PublishOptions {
    strategy?: Strategy;
}
export interface BleSignal {
    rssi: number;
    txPower: number;
}
export interface Distance {
    accuracy: number;
    meters: number;
}
export interface MessageListener {
    onBleSignalChanged: (message: Message, bleSignal: BleSignal) => void;
    onDistanceChanged: (message: Message, distance: Distance) => void;
    onFound: (message: Message) => void;
    onLost: (message: Message) => void;
}
export interface AudioBytes {
    audioData: string;
}
export declare const MAX_SIZE = 10;
export interface includeAudioBytes {
    numAudioBytes: number;
}
export interface includeEddystoneUids {
    hexNamespace: string;
    hexInstance: string;
}
export interface includeIBeaconIds {
    proximityUuid: string;
    major?: number;
    minor?: number;
}
export interface includeNamespacedType {
    namespace: string;
    type: string;
}
export interface MessageFilter {
    INCLUDE_ALL_MY_TYPES?: boolean;
    includeAllMyTypes?: true | void;
    includeAudioBytes?: includeAudioBytes;
    includeEddystoneUids?: includeEddystoneUids;
    includeIBeaconIds?: includeIBeaconIds;
    includeNamespacedType?: includeNamespacedType;
}
export interface SubscribeOptions {
    strategy?: Strategy;
    filter: MessageFilter;
}
export declare type UUID = {
    uuid: string;
};
export interface GoogleNearbyMessagesPlugin {
    initialize(): Promise<void>;
    publish(options: {
        message: Message;
        options?: PublishOptions;
    }): Promise<UUID>;
    unpublish(options: {
        uuid: UUID;
    }): Promise<void>;
    subscribe(options: {
        options?: SubscribeOptions;
    }): Promise<void>;
    unsubscribe(options: {}): Promise<void>;
    pause(): Promise<void>;
    resume(): Promise<void>;
    status(): Promise<void>;
    addListener(eventName: 'onPermissionChanged', listenerFunc: (permissionGranted: boolean) => void): PluginListenerHandle;
    addListener(eventName: 'onBleSignalChanged', listenerFunc: (message: Message, bleSignal: BleSignal) => void): PluginListenerHandle;
    addListener(eventName: 'onDistanceChanged', listenerFunc: (message: Message, distance: Distance) => void): PluginListenerHandle;
    addListener(eventName: 'onFound', listenerFunc: (message: Message) => void): PluginListenerHandle;
    addListener(eventName: 'onLost', listenerFunc: (message: Message) => void): PluginListenerHandle;
    addListener(eventName: 'onPublishExpired', listenerFunc: (uuid: UUID) => void): PluginListenerHandle;
    addListener(eventName: 'onSubscribeExpired', listenerFunc: (uuid: UUID) => void): PluginListenerHandle;
}
export declare const MAX_CONTENT_SIZE_BYTES = 102400;
export declare const MAX_TYPE_LENGTH = 32;
export declare const MESSAGE_NAMESPACE_RESERVED = "__reserved_namespace";
export declare const MESSAGE_TYPE_AUDIO_BYTES = "__audio_bytes";
export declare const MESSAGE_TYPE_EDDYSTONE_UID = "__eddystone_uid";
export declare const MESSAGE_TYPE_I_BEACON_ID = "__i_beacon_id";
export declare enum DiscoveryMode {
    DISCOVERY_MODE_BROADCAST = 1,
    DISCOVERY_MODE_SCAN = 2,
    DISCOVERY_MODE_DEFAULT = 3
}
export declare enum DistanceType {
    DISTANCE_TYPE_DEFAULT = 0,
    DISTANCE_TYPE_EARSHOT = 1
}
export declare enum TTLSeconds {
    TTL_SECONDS_DEFAULT = 300,
    TTL_SECONDS_MAX = 86400,
    TTL_SECONDS_INFINITE = 2147483647
}
export declare const UNKNOWN_TX_POWER = -2147483648;
export declare enum NearbyMessagesStatusCodes {
    TOO_MANY_PENDING_INTENTS = 2801,
    APP_NOT_OPTED_IN = 2802,
    DISALLOWED_CALLING_CONTEXT = 2803,
    APP_QUOTA_LIMIT_REACHED = 2804,
    NOT_AUTHORIZED = 2805,
    FORBIDDEN = 2806,
    MISSING_PERMISSIONS = 2807,
    BLUETOOTH_OFF = 2820,
    BLE_ADVERTISING_UNSUPPORTED = 2821,
    BLE_SCANNING_UNSUPPORTED = 2822
}
export declare enum NearbyPermissions {
    DEFAULT = -1,
    NONE = 0,
    MICROPHONE = 1,
    BLE = 2,
    BLUETOOTH = 6
}
