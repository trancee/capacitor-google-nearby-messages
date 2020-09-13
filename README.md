# Nearby Messages

The Nearby Messages API is a publish-subscribe API that lets you pass small binary payloads between internet-connected Android and iOS devices. The devices don't have to be on the same network, but they do have to be connected to the Internet.

Nearby uses a combination of Bluetooth, Bluetooth Low Energy, Wi-Fi and near-ultrasonic audio to communicate a unique-in-time pairing code between devices. The server facilitates message exchange between devices that detect the same pairing code. When a device detects a pairing code from a nearby device, it sends the pairing code to the Nearby Messages server for validation, and to check whether there are any messages to deliver for the application’s current set of subscriptions.

[Overview](https://developers.google.com/nearby/messages/overview)

## Android

To use the Nearby Messages APIs, you need a [Google Account](https://developer.android.com/google/play-services/index.html). This is so that you, the developer, can enable the Nearby API in the next step (your users will not need to have a Google account). If you already have an account, then you're all set. You may also want a separate Google Account for testing purposes.

Get an API key, then configure your manifest with the API Key generated:

```java
<manifest xmlns:android="http://schemas.android.com/apk/res/android"
    package="com.google.sample.app" >
    <application ...>
        <meta-data
            android:name="com.google.android.nearby.messages.API_KEY"
            android:value="API_KEY" />
        <activity>
        ...
        </activity>
    </application>
</manifest>
```

[Get Started](https://developers.google.com/nearby/messages/android/get-started)

## iOS

To use the Nearby Messages APIs, you need a [Google Account](https://www.google.com/accounts/NewAccount). If you already have an account, then you're all set. You may also want a separate Google Account for testing purposes.

Get an API key, then pass it as the *apiKey* argument in the `initialize` method.

[Get Started](https://developers.google.com/nearby/messages/ios/get-started)

```sh
cd ios
pod repo update
pod install
pod update
```
