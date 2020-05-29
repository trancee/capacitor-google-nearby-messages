// The maximum size of the audio message payload.
// Only MAX_SIZE bytes will be sent over the audio medium.
// https://developers.google.com/android/reference/com/google/android/gms/nearby/messages/audio/AudioBytes#constant-summary
export const MAX_SIZE = 10;
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
export var DiscoveryMode;
(function (DiscoveryMode) {
    // To discover which devices are nearby, broadcast a pairing code for others to scan.
    DiscoveryMode[DiscoveryMode["DISCOVERY_MODE_BROADCAST"] = 1] = "DISCOVERY_MODE_BROADCAST";
    // To discover which devices are nearby, scan for other devices' pairing codes.
    DiscoveryMode[DiscoveryMode["DISCOVERY_MODE_SCAN"] = 2] = "DISCOVERY_MODE_SCAN";
    // To discover which devices are nearby, broadcast a pairing code and scan for other devices' pairing codes.
    // This is equivalent to DISCOVERY_MODE_BROADCAST | DISCOVERY_MODE_SCAN.
    DiscoveryMode[DiscoveryMode["DISCOVERY_MODE_DEFAULT"] = 3] = "DISCOVERY_MODE_DEFAULT";
})(DiscoveryMode || (DiscoveryMode = {}));
// https://developers.google.com/android/reference/com/google/android/gms/nearby/messages/Strategy#constant-summary
export var DistanceType;
(function (DistanceType) {
    // Allows the message be exchanged over any distance.
    DistanceType[DistanceType["DISTANCE_TYPE_DEFAULT"] = 0] = "DISTANCE_TYPE_DEFAULT";
    // Allows the message be exchanged within earshot only.
    // It is recommended that this configuration is used in conjunction with DISCOVERY_MODE_BROADCAST.
    // This will improve the detection latency.
    DistanceType[DistanceType["DISTANCE_TYPE_EARSHOT"] = 1] = "DISTANCE_TYPE_EARSHOT";
})(DistanceType || (DistanceType = {}));
// https://developers.google.com/android/reference/com/google/android/gms/nearby/messages/Strategy#constant-summary
export var TTLSeconds;
(function (TTLSeconds) {
    // The default time to live in seconds.
    TTLSeconds[TTLSeconds["TTL_SECONDS_DEFAULT"] = 300] = "TTL_SECONDS_DEFAULT";
    // The maximum time to live in seconds, if not TTL_SECONDS_INFINITE.
    TTLSeconds[TTLSeconds["TTL_SECONDS_MAX"] = 86400] = "TTL_SECONDS_MAX";
    // An infinite time to live in seconds.
    // Note: This is currently only supported for subscriptions.
    TTLSeconds[TTLSeconds["TTL_SECONDS_INFINITE"] = 2147483647] = "TTL_SECONDS_INFINITE";
})(TTLSeconds || (TTLSeconds = {}));
// Unknown transmission power level.
// https://developers.google.com/android/reference/com/google/android/gms/nearby/messages/BleSignal#constant-summary
export const UNKNOWN_TX_POWER = -2147483648;
// Nearby.Messages specific status codes, for use in getStatusCode().
// https://developers.google.com/android/reference/com/google/android/gms/nearby/messages/NearbyMessagesStatusCodes#constant-summary
export var NearbyMessagesStatusCodes;
(function (NearbyMessagesStatusCodes) {
    // The app has issued more than 5 PendingIntent to the Messages#subscribe.
    // Some requests need to be removed before adding more.
    NearbyMessagesStatusCodes[NearbyMessagesStatusCodes["TOO_MANY_PENDING_INTENTS"] = 2801] = "TOO_MANY_PENDING_INTENTS";
    // Status code indicating that the User has not granted the calling application permission to use Nearby.Messages.
    NearbyMessagesStatusCodes[NearbyMessagesStatusCodes["APP_NOT_OPTED_IN"] = 2802] = "APP_NOT_OPTED_IN";
    // The app is issuing an operation using a GoogleApiClient bound to an inappropriate Context;
    // see the relevant method's documentation (for example, publish(GoogleApiClient, Message, PublishOptions)) to see its list of allowed Contexts.
    NearbyMessagesStatusCodes[NearbyMessagesStatusCodes["DISALLOWED_CALLING_CONTEXT"] = 2803] = "DISALLOWED_CALLING_CONTEXT";
    // The app has reached its quota limit to use Nearby Messages API.
    // Use the Quota request form for the Nearby Messages API in your project's developer console to request more quota.
    NearbyMessagesStatusCodes[NearbyMessagesStatusCodes["APP_QUOTA_LIMIT_REACHED"] = 2804] = "APP_QUOTA_LIMIT_REACHED";
    NearbyMessagesStatusCodes[NearbyMessagesStatusCodes["NOT_AUTHORIZED"] = 2805] = "NOT_AUTHORIZED";
    // The request could not be completed because it was disallowed.
    // The issue is not resolvable by the client, and the request should not be retried.
    NearbyMessagesStatusCodes[NearbyMessagesStatusCodes["FORBIDDEN"] = 2806] = "FORBIDDEN";
    // The request could not be completed because it was disallowed.
    // Check the error message to see what permission is missing and make sure the right NearbyPermissions is specified for setPermissions(int).
    NearbyMessagesStatusCodes[NearbyMessagesStatusCodes["MISSING_PERMISSIONS"] = 2807] = "MISSING_PERMISSIONS";
    // Bluetooth is currently off.
    NearbyMessagesStatusCodes[NearbyMessagesStatusCodes["BLUETOOTH_OFF"] = 2820] = "BLUETOOTH_OFF";
    // The client requested an operation that requires Bluetooth Low Energy advertising (such as publishing with BLE_ONLY), but this feature is not supported.
    NearbyMessagesStatusCodes[NearbyMessagesStatusCodes["BLE_ADVERTISING_UNSUPPORTED"] = 2821] = "BLE_ADVERTISING_UNSUPPORTED";
    // The client requested an operation that requires Bluetooth Low Energy scanning (such as subscribing with BLE_ONLY), but this feature is not supported.
    NearbyMessagesStatusCodes[NearbyMessagesStatusCodes["BLE_SCANNING_UNSUPPORTED"] = 2822] = "BLE_SCANNING_UNSUPPORTED";
})(NearbyMessagesStatusCodes || (NearbyMessagesStatusCodes = {}));
// Determines the scope of permissions Nearby will ask for at connection time.
// https://developers.google.com/android/reference/com/google/android/gms/nearby/messages/NearbyPermissions#constant-summary
export var NearbyPermissions;
(function (NearbyPermissions) {
    NearbyPermissions[NearbyPermissions["DEFAULT"] = -1] = "DEFAULT";
    NearbyPermissions[NearbyPermissions["NONE"] = 0] = "NONE";
    NearbyPermissions[NearbyPermissions["MICROPHONE"] = 1] = "MICROPHONE";
    NearbyPermissions[NearbyPermissions["BLE"] = 2] = "BLE";
    NearbyPermissions[NearbyPermissions["BLUETOOTH"] = 6] = "BLUETOOTH";
})(NearbyPermissions || (NearbyPermissions = {}));
//# sourceMappingURL=definitions.js.map