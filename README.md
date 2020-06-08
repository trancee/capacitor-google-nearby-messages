To make use of Background mode, we still need to define flags in Info.plist.

bluetooth-peripheral: If we want to use a peripheral in background;
bluetooth-central: If we want to use a central in background.
If we add support via Target > Capabilities > Background Modes, by selecting Uses Bluetooth LE accessories (central) and/or Act as Bluetooth LE accessory (peripheral), they are automatically added to Info.plist.

Important: Do not forget to add the flag Privacy Flag - Bluetooth Peripheral Usage Description so that the user gets asked for permission for the app to use the device as a peripheral, just as we do when we want to use the camera or location.

This app has crashed because it attempted to access privacy-sensitive data without a usage description.  The app's Info.plist must contain an NSBluetoothAlwaysUsageDescription key with a string value explaining to the user how the app uses this data.
