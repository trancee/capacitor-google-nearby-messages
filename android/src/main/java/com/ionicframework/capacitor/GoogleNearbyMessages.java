package com.ionicframework.capacitor;

import android.Manifest;
import android.content.Intent;
import android.content.pm.PackageManager;
import android.util.Base64;
import android.util.Log;
import android.widget.Toast;

import com.getcapacitor.JSObject;
import com.getcapacitor.NativePlugin;
import com.getcapacitor.Plugin;
import com.getcapacitor.PluginCall;
import com.getcapacitor.PluginMethod;
import com.google.android.gms.nearby.Nearby;
import com.google.android.gms.nearby.messages.BleSignal;
import com.google.android.gms.nearby.messages.Distance;
import com.google.android.gms.nearby.messages.Message;
import com.google.android.gms.nearby.messages.MessageFilter;
import com.google.android.gms.nearby.messages.MessageListener;
import com.google.android.gms.nearby.messages.MessagesClient;
import com.google.android.gms.nearby.messages.MessagesOptions;
import com.google.android.gms.nearby.messages.NearbyPermissions;
import com.google.android.gms.nearby.messages.PublishCallback;
import com.google.android.gms.nearby.messages.PublishOptions;
import com.google.android.gms.nearby.messages.StatusCallback;
import com.google.android.gms.nearby.messages.Strategy;
import com.google.android.gms.nearby.messages.SubscribeCallback;
import com.google.android.gms.nearby.messages.SubscribeOptions;

import java.util.UUID;

@NativePlugin(
        // Some Plugins will require you to request permissions.
        // First declare your plugin permissions.
        permissions = {
                Manifest.permission.BLUETOOTH,
                Manifest.permission.BLUETOOTH_ADMIN,
                Manifest.permission.ACCESS_WIFI_STATE,
                Manifest.permission.CHANGE_WIFI_STATE,
                Manifest.permission.ACCESS_COARSE_LOCATION,
                Manifest.permission.ACCESS_FINE_LOCATION,
        }
)
public class GoogleNearbyMessages extends Plugin {
    private boolean isSubscribing = false;
    private boolean isPublishing = false;

    private MessagesClient mMessagesClient;
    private MessageListener mMessageListener;
    private Message mActiveMessage;

    private PublishOptions mPublishOptions;
    private SubscribeOptions mSubscribeOptions;

    protected void handleOnNewIntent(Intent intent) {
        // Creates a new instance of MessagesClient.
        mMessagesClient = Nearby.getMessagesClient(getContext(),
                // Configuration parameters for the Messages API.
                new MessagesOptions.Builder()
                        // Sets which NearbyPermissions are requested for Nearby.
                        .setPermissions(
                                // Determines the scope of permissions Nearby will ask for at connection time.
                                NearbyPermissions.DEFAULT
                        )
                        .build()
        );

        // Registers a status callback, which will be notified when significant events occur that affect Nearby for your app.
        mMessagesClient.registerStatusCallback(
                // Callbacks for global status changes that affect a client of Nearby Messages.
                new StatusCallback() {
                    @Override
                    // Called when permission is granted or revoked for this app to use Nearby.
                    public void onPermissionChanged(boolean permissionGranted) {
                        super.onPermissionChanged(permissionGranted);

                        Log.i(getLogTag(),
                                String.format(
                                        "onPermissionChanged(permissionGranted=%s)",
                                        permissionGranted));
                        /*
                        Toast.makeText(getContext(),
                                String.format(
                                        "onPermissionChanged(permissionGranted=%s)",
                                        permissionGranted),
                                Toast.LENGTH_SHORT).show();
                        */
                        JSObject data = new JSObject();
                        data.put("permissionGranted", permissionGranted);

                        notifyListeners("onPermissionChanged", data);
                    }
                }
        );

        // https://developers.google.com/android/reference/com/google/android/gms/nearby/messages/MessageListener
        mMessageListener = new MessageListener() {
            // A listener for receiving subscribed messages. These callbacks will be delivered when messages are found or lost.

            /**
             * Called when the Bluetooth Low Energy (BLE) signal associated with a message changes.
             *
             * This is currently only called for BLE beacon messages.
             *
             * For example, this is called when we see the first BLE advertisement
             * frame associated with a message; or when we see subsequent frames with
             * significantly different received signal strength indicator (RSSI)
             * readings.
             *
             * For more information, see the MessageListener Javadocs.
             */
            // https://developers.google.com/nearby/messages/android/advanced#rssi_and_distance_callbacks
            @Override
            public void onBleSignalChanged(final Message message, final BleSignal bleSignal) {
                Log.i(getLogTag(),
                        String.format(
                                "onBleSignalChanged(message=%s, bleSignal=%s)",
                                message, bleSignal));

                Toast.makeText(getContext(),
                        String.format(
                                "onBleSignalChanged(message=%s, bleSignal=%s)",
                                message, bleSignal),
                        Toast.LENGTH_SHORT).show();

                {
                    JSObject messageObject = new JSObject();
                    // Returns the type that describes the content of the message.
                    messageObject.put("type", message.getType());
                    // Returns the raw bytes content of the message.
                    messageObject.put("content", Base64.encodeToString(message.getContent(), Base64.DEFAULT | Base64.NO_WRAP));
                    // Returns the non-empty string for a public namespace or empty for the private one.
                    messageObject.put("namespace", message.getNamespace());

                    JSObject bleSignalObject = new JSObject();
                    // Returns the received signal strength indicator (RSSI) in dBm.
                    bleSignalObject.put("rssi", bleSignal.getRssi());
                    // Returns the transmission power level at 1 meter, in dBm.
                    bleSignalObject.put("txPower", bleSignal.getTxPower());

                    JSObject data = new JSObject();
                    data.put("message", messageObject);
                    data.put("bleSignal", bleSignalObject);

                    notifyListeners("onBleSignalChanged", data);
                }
            }

            /**
             * Called when Nearby's estimate of the distance to a message changes.
             *
             * This is currently only called for BLE beacon messages.
             *
             * For example, this is called when we first gather enough information
             * to make a distance estimate; or when the message remains nearby,
             * but gets closer or further away.
             *
             * For more information, see the MessageListener Javadocs.
             */
            // https://developers.google.com/nearby/messages/android/advanced#rssi_and_distance_callbacks
            @Override
            public void onDistanceChanged(final Message message, final Distance distance) {
                Log.i(getLogTag(),
                        String.format(
                                "onDistanceChanged(message=%s, distance=%s)",
                                message, distance));

                Toast.makeText(getContext(),
                        String.format(
                                "onDistanceChanged(message=%s, distance=%s)",
                                message, distance),
                        Toast.LENGTH_SHORT).show();

                {
                    JSObject messageObject = new JSObject();
                    // Returns the type that describes the content of the message.
                    messageObject.put("type", message.getType());
                    // Returns the raw bytes content of the message.
                    messageObject.put("content", Base64.encodeToString(message.getContent(), Base64.DEFAULT | Base64.NO_WRAP));
                    // Returns the non-empty string for a public namespace or empty for the private one.
                    messageObject.put("namespace", message.getNamespace());

                    JSObject distanceObject = new JSObject();
                    // The accuracy of the distance estimate.
                    distanceObject.put("accuracy", distance.getAccuracy());
                    // The distance estimate, in meters.
                    distanceObject.put("meters", distance.getMeters());

                    JSObject data = new JSObject();
                    data.put("message", messageObject);
                    data.put("distance", distanceObject);

                    notifyListeners("onDistanceChanged", data);
                }
            }

            /**
             * Called when messages are found.
             *
             * This method is called the first time the message is seen nearby.
             *
             * After a message has been lost (see onLost(Message)), it's eligible
             * for onFound(Message) again.
             */
            @Override
            public void onFound(final Message message) {
                Log.i(getLogTag(),
                        String.format(
                                "onFound(message=%s, type=%s, content=%s)",
                                message, message.getType(), new String(message.getContent())));
                /*
                Toast.makeText(getContext(),
                        String.format(
                                "onFound(message=%s, type=%s, content=%s)",
                                message, message.getType(), new String(message.getContent())),
                        Toast.LENGTH_SHORT).show();
                */
                {
                    JSObject messageObject = new JSObject();
                    // Returns the type that describes the content of the message.
                    messageObject.put("type", message.getType());
                    // Returns the raw bytes content of the message.
                    messageObject.put("content", Base64.encodeToString(message.getContent(), Base64.DEFAULT | Base64.NO_WRAP));
                    // Returns the non-empty string for a public namespace or empty for the private one.
                    messageObject.put("namespace", message.getNamespace());

                    JSObject data = new JSObject();
                    data.put("message", messageObject);

                    notifyListeners("onFound", data);
                }
            }

            /**
             * Called when a message is no longer detectable nearby.
             *
             * Note: This callback currently works best for BLE beacon messages.
             * For other messages, it may not be called in a timely fashion, or at all.
             *
             * This method will not be called repeatedly (unless the message is
             * found again between lost calls).
             */
            @Override
            public void onLost(final Message message) {
                Log.i(getLogTag(),
                        String.format(
                                "onLost(message=%s, type=%s, content=%s)",
                                message, message.getType(), new String(message.getContent())));
                /*
                Toast.makeText(getContext(),
                        String.format(
                                "onLost(message=%s, type=%s, content=%s)",
                                message, message.getType(), new String(message.getContent())),
                        Toast.LENGTH_SHORT).show();
                */
                {
                    JSObject messageObject = new JSObject();
                    // Returns the type that describes the content of the message.
                    messageObject.put("type", message.getType());
                    // Returns the raw bytes content of the message.
                    messageObject.put("content", Base64.encodeToString(message.getContent(), Base64.DEFAULT | Base64.NO_WRAP));
                    // Returns the non-empty string for a public namespace or empty for the private one.
                    messageObject.put("namespace", message.getNamespace());

                    JSObject data = new JSObject();
                    data.put("message", messageObject);

                    notifyListeners("onLost", data);
                }
            }
        };
    }

    @PluginMethod()
    public void status(PluginCall call) {
        Log.i(getLogTag(),
                String.format(
                        "status(isPublishing=%s, isSubscribing=%s)",
                        isPublishing, isSubscribing));
        /*
        Toast.makeText(getContext(),
                String.format(
                        "status(isPublishing=%s, isSubscribing=%s)",
                        isPublishing, isSubscribing),
                Toast.LENGTH_SHORT).show();
        */
        JSObject data = new JSObject();
        data.put("isPublishing", isPublishing);
        data.put("isSubscribing", isSubscribing);
        call.success(data);
    }

    @PluginMethod()
    // https://developers.google.com/nearby/messages/android/pub-sub#publish_a_message
    public void publish(PluginCall call) {
        if (mActiveMessage != null) {
            doUnpublish();

            mActiveMessage = null;
        }

        isPublishing = false;

        try {
            //Log.i(getLogTag(), "Publishing.");

            Message message = null;
            Strategy strategy = null;

            JSObject messageObject = call.getObject("message", null);
            if (messageObject != null) {
                String content = messageObject.getString("content");
                String type = messageObject.getString("type");

                // A message that will be shared with nearby devices.
                message = new Message(
                        // An arbitrary array holding the content of the message. The maximum content size is MAX_CONTENT_SIZE_BYTES.
                        Base64.decode(content, Base64.DEFAULT),
                        // A string that describe what the bytes of the content represent. The maximum type length is MAX_TYPE_LENGTH.
                        type
                );
            }

            JSObject optionsObject = call.getObject("options", null);
            if (optionsObject != null) {
                JSObject strategyObject = optionsObject.getJSObject("strategy", null);

                if (strategyObject != null) {
                    if (strategyObject.getBoolean("DEFAULT", false)) {
                        // The default strategy, which is suitable for most applications.
                        strategy = Strategy.DEFAULT;
                    } else if (strategyObject.getBoolean("BLE_ONLY", false)) {
                        // Use only Bluetooth Low Energy to discover nearby devices. Recommended if you are only interested in messages attached to BLE beacons.
                        strategy = Strategy.BLE_ONLY;
                    } else {
                        Integer discoveryMode = strategyObject.getInteger("discoveryMode");
                        Integer distanceType = strategyObject.getInteger("distanceType");
                        Integer ttlSeconds = strategyObject.getInteger("ttlSeconds");

                        // Builder for Strategy.
                        // https://developers.google.com/android/reference/com/google/android/gms/nearby/messages/Strategy.Builder
                        Strategy.Builder builder = new Strategy.Builder();

                        if (discoveryMode != null) {
                            // Sets the desired discovery mode that determines how devices will detect each other.
                            builder.setDiscoveryMode(discoveryMode);
                        }
                        if (distanceType != null) {
                            // Message will only be delivered to subscribing devices that are at most the specified distance from this device.
                            builder.setDistanceType(distanceType);
                        }
                        if (ttlSeconds != null) {
                            // Sets the time to live in seconds for the publish or subscribe.
                            builder.setTtlSeconds(ttlSeconds);
                        }

                        // Builds an instance of Strategy.
                        strategy = builder
                                .build();
                    }
                }
            }

            // Builder for instances of PublishOptions.
            // https://developers.google.com/android/reference/com/google/android/gms/nearby/messages/PublishOptions.Builder
            PublishOptions.Builder options = new PublishOptions.Builder()
                    // Sets a callback which will be notified when significant events occur that affect this publish.
                    .setCallback(
                            // Callback for events which affect published messages.
                            // https://developers.google.com/android/reference/com/google/android/gms/nearby/messages/PublishCallback
                            new PublishCallback() {
                                /**
                                 * The published message is expired.
                                 *
                                 * Called if any of the following happened:
                                 *
                                 *  - The specified TTL for the call elapsed.
                                 *  - User stopped the Nearby actions for the app.
                                 *
                                 * Using this callback is recommended for cases when you need to update
                                 * state (e.g. UI elements) when published messages expire.
                                 */
                                @Override
                                public void onExpired() {
                                    super.onExpired();

                                    Log.i(getLogTag(), "The published message is expired.");
                                    Toast.makeText(getContext(), "The published message is expired.", Toast.LENGTH_SHORT).show();

                                    isPublishing = false;

                                    notifyListeners("onPublishExpired", null);
                                }
                            }
                    );

            if (strategy != null) {
                // Sets the strategy for publishing.
                options.setStrategy(strategy);
            }

            mPublishOptions = options.build();
            mActiveMessage = message;

            doPublish(call);
        } catch (Exception e) {
            call.error(e.getLocalizedMessage(), e);
        }
    }

    private void doPublish(PluginCall call) {
        if (mMessagesClient != null) {
            // Publishes a message so that it is visible to nearby devices.
            mMessagesClient
                    .publish(
                            // A Message to publish for nearby devices to see
                            mActiveMessage,
                            // A PublishOptions object for this operation
                            mPublishOptions
                    )
                    .addOnSuccessListener(
                            (Void) -> {
                                // Toast.makeText(getContext(), "We are publishing", Toast.LENGTH_SHORT).show();

                                isPublishing = true;

                                call.success();
                            })
                    .addOnFailureListener(
                            (Exception e) -> {
                                // Toast.makeText(getContext(), "Unable to start publishing: " + e, Toast.LENGTH_SHORT).show();

                                isPublishing = false;

                                call.error(e.getLocalizedMessage(), e);
                            });
        }
    }

    @PluginMethod()
    // https://developers.google.com/nearby/messages/android/pub-sub#unpublish_a_message
    public void unpublish(PluginCall call) {
        try {
            //Log.i(getLogTag(), "Unpublishing.");

            if (mActiveMessage != null) {
                doUnpublish();

                mActiveMessage = null;
                mPublishOptions = null;
            }

            isPublishing = false;

            call.success();
        } catch (Exception e) {
            call.error(e.getLocalizedMessage(), e);
        }
    }

    private void doUnpublish() {
        if (mMessagesClient != null) {
            // Cancels an existing published message.
            mMessagesClient.unpublish(
                    // A Message that is currently published
                    mActiveMessage
            );
        }
    }

    @PluginMethod()
    // https://developers.google.com/nearby/messages/android/pub-sub#subscribe_to_messages
    public void subscribe(PluginCall call) {
        try {
            //Log.i(getLogTag(), "Subscribing.");

            Strategy strategy = null;
            MessageFilter filter = null;

            JSObject optionsObject = call.getObject("options", null);
            if (optionsObject != null) {
                JSObject strategyObject = optionsObject.getJSObject("strategy", null);

                if (strategyObject != null) {
                    if (strategyObject.getBoolean("DEFAULT", false)) {
                        // The default strategy, which is suitable for most applications.
                        strategy = Strategy.DEFAULT;
                    } else if (strategyObject.getBoolean("BLE_ONLY", false)) {
                        // Use only Bluetooth Low Energy to discover nearby devices. Recommended if you are only interested in messages attached to BLE beacons.
                        strategy = Strategy.BLE_ONLY;
                    } else {
                        Integer discoveryMode = strategyObject.getInteger("discoveryMode");
                        Integer distanceType = strategyObject.getInteger("distanceType");
                        Integer ttlSeconds = strategyObject.getInteger("ttlSeconds");

                        // Builder for Strategy.
                        // https://developers.google.com/android/reference/com/google/android/gms/nearby/messages/Strategy.Builder
                        Strategy.Builder builder = new Strategy.Builder();

                        if (discoveryMode != null) {
                            // Sets the desired discovery mode that determines how devices will detect each other.
                            builder.setDiscoveryMode(discoveryMode);
                        }
                        if (distanceType != null) {
                            // Message will only be delivered to subscribing devices that are at most the specified distance from this device.
                            builder.setDistanceType(distanceType);
                        }
                        if (ttlSeconds != null) {
                            // Sets the time to live in seconds for the publish or subscribe.
                            builder.setTtlSeconds(ttlSeconds);
                        }

                        // Builds an instance of Strategy.
                        strategy = builder
                                .build();
                    }
                }

                JSObject filterObject = optionsObject.getJSObject("filter", null);

                if (filterObject != null) {
                    if (filterObject.getBoolean("INCLUDE_ALL_MY_TYPES", false)) {
                        // A convenient filter that returns all types of messages published by this application's project.
                        filter = MessageFilter.INCLUDE_ALL_MY_TYPES;
                    } else {
                        // Builder for MessageFilter.
                        // https://developers.google.com/android/reference/com/google/android/gms/nearby/messages/MessageFilter.Builder
                        MessageFilter.Builder builder = new MessageFilter.Builder();

                        if (filterObject.getBoolean("includeAllMyTypes", false)) {
                            // Filters for all messages published by this application (and any other applications in the same Google Developers Console project), regardless of type.
                            builder.includeAllMyTypes();
                        }

                        JSObject includeAudioBytes = filterObject.getJSObject("includeAudioBytes", null);
                        if (includeAudioBytes != null) {
                            int numAudioBytes = includeAudioBytes.getInteger("numAudioBytes");

                            // Includes raw audio byte messages.
                            builder.includeAudioBytes(
                                    // Number of bytes for the audio bytes message (capped by MAX_SIZE).
                                    numAudioBytes
                            );
                        }

                        JSObject includeEddystoneUids = filterObject.getJSObject("includeEddystoneUids", null);
                        if (includeEddystoneUids != null) {
                            String hexNamespace = includeEddystoneUids.getString("hexNamespace");
                            String hexInstance = includeEddystoneUids.getString("hexInstance");

                            // Includes Eddystone UIDs.
                            builder.includeEddystoneUids(
                                    // The 10-byte Eddystone UID namespace in hex format. For example, "a032ffed0532bca3846d".
                                    hexNamespace,
                                    // An optional 6-byte Eddystone UID instance in hex format. For example, "00aabbcc2233".
                                    hexInstance
                            );
                        }

                        JSObject includeIBeaconIds = filterObject.getJSObject("includeIBeaconIds", null);
                        if (includeIBeaconIds != null) {
                            String proximityUuid = includeIBeaconIds.getString("proximityUuid");
                            Integer major = includeIBeaconIds.getInteger("major");
                            Integer minor = includeIBeaconIds.getInteger("minor");

                            // Includes iBeacon IDs.
                            builder.includeIBeaconIds(
                                    // The proximity UUID.
                                    UUID.fromString(proximityUuid),
                                    // An optional major value.
                                    major.shortValue(),
                                    // An optional minor value.
                                    minor.shortValue()
                            );
                        }

                        JSObject includeNamespacedType = filterObject.getJSObject("includeNamespacedType", null);
                        if (includeNamespacedType != null) {
                            String namespace = includeNamespacedType.getString("namespace");
                            String type = includeNamespacedType.getString("type");

                            // Filters for all messages in the given namespace with the given type.
                            builder.includeNamespacedType(
                                    // The namespace that the message belongs to. It must be non-empty and cannot contain the following invalid character: star(*).
                                    namespace,
                                    // The type of the message to include. It must non-null and cannot contain the following invalid character: star(*).
                                    type
                            );
                        }

                        // Builds an instance of MessageFilter.
                        filter = builder
                                .build();
                    }
                }
            }

            // Builder for instances of SubscribeOptions.
            // https://developers.google.com/android/reference/com/google/android/gms/nearby/messages/SubscribeOptions.Builder
            SubscribeOptions.Builder options = new SubscribeOptions.Builder()
                    // Sets a callback which will be notified when significant events occur that affect this subscription.
                    .setCallback(
                            // Callback for events which affect subscriptions.
                            // https://developers.google.com/android/reference/com/google/android/gms/nearby/messages/SubscribeCallback
                            new SubscribeCallback() {
                                /**
                                 * The subscription is expired.
                                 *
                                 * Called if any of the following happened:
                                 *
                                 * - The specified TTL for the call elapsed.
                                 * - User stopped the Nearby actions for the app.
                                 *
                                 * Using this callback is recommended for cases when you need to update
                                 * state (e.g. UI elements) when subscriptions expire.
                                 */
                                @Override
                                public void onExpired() {
                                    super.onExpired();

                                    Log.i(getLogTag(), "The subscription is expired.");
                                    Toast.makeText(getContext(), "The subscription is expired.", Toast.LENGTH_SHORT).show();

                                    isSubscribing = false;

                                    notifyListeners("onSubscribeExpired", null);
                                }
                            }
                    );

            if (strategy != null) {
                // Sets a strategy for subscribing.
                options.setStrategy(strategy);
            }

            if (filter != null) {
                // Sets a filter to specify which messages to receive.
                options.setFilter(filter);
            }

            mSubscribeOptions = options.build();

            doSubscribe(call);
        } catch (Exception e) {
            call.error(e.getLocalizedMessage(), e);
        }
    }

    private void doSubscribe(PluginCall call) {
        if (mMessagesClient != null) {
            // Subscribes for published messages from nearby devices.
            mMessagesClient
                    .subscribe(
                            // A MessageListener implementation to get callbacks of received messages
                            mMessageListener,
                            // A SubscribeOptions object for this operation
                            mSubscribeOptions
                    )
                    .addOnSuccessListener(
                            (Void) -> {
                                // Toast.makeText(getContext(), "We are subscribed", Toast.LENGTH_SHORT).show();

                                isSubscribing = true;

                                call.success();
                            })
                    .addOnFailureListener(
                            (Exception e) -> {
                                // Toast.makeText(getContext(), "Unable to start subscribing: " + e, Toast.LENGTH_SHORT).show();

                                isSubscribing = false;

                                call.error(e.getLocalizedMessage(), e);
                            });
        }
    }

    @PluginMethod()
    // https://developers.google.com/nearby/messages/android/pub-sub#unsubscribe
    public void unsubscribe(PluginCall call) {
        try {
            //Log.i(getLogTag(), "Unsubscribing.");

            if (isSubscribing && mMessagesClient != null) {
                doUnsubscribe();

                mSubscribeOptions = null;
            }

            isSubscribing = false;

            call.success();
        } catch (Exception e) {
            call.error(e.getLocalizedMessage(), e);
        }
    }

    private void doUnsubscribe() {
        if (mMessagesClient != null) {
            // Cancels an existing subscription.
            mMessagesClient.unsubscribe(
                    // A MessageListener implementation that is currently subscribed
                    mMessageListener
            );
        }
    }

    @PluginMethod()
    public void pause(PluginCall call) {
        try {
            //Log.i(getLogTag(), "Pausing.");

            if (isPublishing) {
                doUnpublish();
            }
            if (isSubscribing) {
                doUnsubscribe();
            }

            call.success();
        } catch (Exception e) {
            call.error(e.getLocalizedMessage(), e);
        }
    }

    @PluginMethod()
    public void resume(PluginCall call) {
        try {
            //Log.i(getLogTag(), "Resuming.");

            if (isPublishing) {
                doPublish(call);
            }
            if (isSubscribing) {
                doSubscribe(call);
            }

            call.success();
        } catch (Exception e) {
            call.error(e.getLocalizedMessage(), e);
        }
    }
}
