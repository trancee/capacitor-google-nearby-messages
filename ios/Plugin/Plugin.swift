import Foundation
import Capacitor

struct Constants {
    static let NOT_INITIALIZED = "Nearby Messages API not initialized"
    static let INITIALIZE_API_KEY = "Most provide apiKey"
    static let PERMISSION_DENIED = "Nearby permissions not granted"
    static let PERMISSION_MICROPHONE_DENIED = "Microphone permission is denied"
    static let PERMISSION_BLUETOOTH_DENIED = "Bluetooth permission is denied"
    static let PERMISSION_BLUETOOTH_OFF = "Bluetooth is powered off"
    static let PUBLISH_MESSAGE_CONTENT = "Must provide message with content"
    static let PUBLISH_MESSAGE_TYPE = "Must provide message with type"
    static let PUBLISH_MESSAGE = "Must provide message"
    static let PUBLISH_ERROR = "Unable to publish message"
    static let MESSAGE_UUID_INVALID = "Message UUID invalid"
    static let MESSAGE_UUID_NOT_FOUND = "Message UUID not found"
}

/**
 * Please read the Capacitor iOS Plugin Development Guide
 * here: https://capacitor.ionicframework.com/docs/plugins/ios
 */
@objc(GoogleNearbyMessages)
public class GoogleNearbyMessages: CAPPlugin {
    struct MessageOptions {
        var publication: GNSPublication?

        var message: GNSMessage?
        var options: GNSPublicationParamsBlock?
    }

    /**
     * @property
     * The message manager lets you create publications and subscriptions.  They are valid only as long
     * as the manager exists.
     */
    var messageManager: GNSMessageManager?
    var nearbyPermission: GNSPermission?

    var publications = [String : MessageOptions]()

    var subscription: GNSSubscription?
    var subscriptionOptions: GNSSubscriptionParamsBlock?

    @objc func initialize(_ call: CAPPluginCall) {
        guard let apiKey = call.getString("apiKey") else {
            call.reject(Constants.INITIALIZE_API_KEY)
            return
        }

        do {
            if self.messageManager == nil {
                // Enable debug logging to help track down problems.
                GNSMessageManager.setDebugLoggingEnabled(true)

                // Create the message manager, which lets you publish messages and subscribe to messages
                // published by nearby devices.
                self.messageManager = GNSMessageManager(
                    // The API key of the app, required to use the Messages service
                    apiKey: apiKey,

                    // Use this block to pass additional parameters
                    paramsBlock: {
                        // Additional parameters for the message manager.
                        (params: GNSMessageManagerParams?) -> Void in
                        guard let params = params else { return }

                        // Show the system alert when Bluetooth is off.
                        params.shouldShowBluetoothPowerAlert = true

                        // The following error handlers are called (on the main thread) when the status of the error changes.
                        params.microphonePermissionErrorHandler = { (hasError: Bool) in
                            if (hasError) {
                                call.error(Constants.PERMISSION_MICROPHONE_DENIED)
                            }
                        }
                        // Bluetooth permission is denied.
                        params.bluetoothPermissionErrorHandler = { (hasError: Bool) in
                            if (hasError) {
                                call.error(Constants.PERMISSION_BLUETOOTH_DENIED)
                            }
                        }
                        // Bluetooth is powered off.
                        params.bluetoothPowerErrorHandler = { (hasError: Bool) in
                            if (hasError) {
                                call.error(Constants.PERMISSION_BLUETOOTH_OFF)
                            }
                        }

                        // This parameter is relevant only if your app uses the audio medium for discovery.
                        params.shouldUseBestAudioSessionCategory = true
                })
            }

            var savedCall = true

            if self.nearbyPermission == nil {
                // Initializes the permission object with a handler that is called whenever the permission state changes.
                self.nearbyPermission = GNSPermission(
                    // The permission granted handler
                    changedHandler: {
                        (granted: Bool) in

                        self.notifyListeners("onPermissionChanged", data: [
                            "permissionGranted": granted,
                        ])

                        if savedCall {
                            if (granted) {
                                call.success()
                            } else {
                                call.reject(Constants.PERMISSION_DENIED)
                            }

                            savedCall = false
                        }
                })
            }

            if GNSPermission.isGranted() {
                savedCall = false

                call.success()
            }
        } catch let e {
            call.error(e.localizedDescription, e)
        }
    }

    @objc func reset(_ call: CAPPluginCall) {
        do {
            doUnsubscribe()

            self.subscriptionOptions = nil

            self.notifyListeners("onSubscribeExpired", data: nil)
        }

        for (messageUUID, _) in self.publications  {
            doUnpublish(messageUUID)

            self.notifyListeners("onPublishExpired", data: [
                "uuid": messageUUID,
            ])
        }

        self.nearbyPermission = nil
        self.messageManager = nil
    }

    @objc func publish(_ call: CAPPluginCall) {
        if self.messageManager == nil {
            call.reject(Constants.NOT_INITIALIZED)
            return
        }

        // A message is a published object that is delivered between nearby devices.
        let message: GNSMessage
        // The strategy to use to detect nearby devices.
        var strategy: GNSStrategy?

        if let messageObject = call.getObject("message") {
            guard let content = messageObject["content"] else {
                call.reject(Constants.PUBLISH_MESSAGE_CONTENT)
                return
            };

            guard let type = messageObject["type"] else {
                call.reject(Constants.PUBLISH_MESSAGE_TYPE)
                return
            };

            // Message with the specified type.
            message = GNSMessage(
                content: Data(base64Encoded: content as! String),
                type: type as? String
            )
        } else {
            call.reject(Constants.PUBLISH_MESSAGE)
            return
        }

        if let optionsObject = call.getObject("options") {
            if let strategyObject = optionsObject["strategy"] as! [String : Any]? {
                if strategyObject["DEFAULT"] as? Bool == true {
                    strategy = GNSStrategy()
                } else if strategyObject["BLE_ONLY"] as? Bool == true {
                    // Optional params for a strategy.
                    let paramsBlock = {
                        (params: GNSStrategyParams!) -> Void in

                        // Use Bluetooth Low Energy to discover nearby devices.
                        params.discoveryMediums = .BLE

                        // Try to use the discovery strategy when the app is in the background.
                        params.allowInBackground = true
                    }

                    strategy = GNSStrategy(paramsBlock: paramsBlock)
                } else {
                    // Optional params for a strategy.
                    let paramsBlock = {
                        (params: GNSStrategyParams!) -> Void in

                        if let discoveryMode = optionsObject["discoveryMode"] {
                            // For nearby device discovery, one device must broadcast a pairing code and the other device must scan for pairing codes.
                            // default: To discover which devices are nearby, broadcast a pairing code and scan for other devices' pairing codes.
                            // scan: To discover which devices are nearby, scan for other devices' pairing codes. This is useful for scenarios where the pairing device is guaranteed only to broadcast.
                            // broadcast: To discover which devices are nearby, broadcast a pairing code for others to scan. This is useful for scenarios where the pairing device is guaranteed only to scan.
                            params.discoveryMode = GNSDiscoveryMode(rawValue: discoveryMode as! Int)
                        }

                        if let distanceType = optionsObject["distanceType"] {
                            // Controls which mediums to use to broadcast and scan pairing codes when discovering nearby devices.
                            // default: Let Nearby decide which mediums are used to discover nearby devices.
                            // audio: Use near-ultrasonic audio to discover nearby devices.
                            params.discoveryMediums = GNSDiscoveryMediums(rawValue: distanceType as! Int)
                        }

                        // Try to use the discovery strategy when the app is in the background.
                        params.allowInBackground = true
                    }

                    strategy = GNSStrategy(paramsBlock: paramsBlock)
                }
            }
        }

        do {
            let messageUUID: String = UUID().uuidString

            let paramsBlock = {
                // Optional parameters for a publication.
                (params: GNSPublicationParams!) -> Void in

                // The strategy to use for publishing the message.
                params.strategy = strategy

                params.statusHandler = {
                    // Status of an operation (publication or subscription).
                    (operationStatus: GNSOperationStatus!) -> Void in
                    var status: String

                    switch operationStatus {
                    case .starting:
                        status = "STARTING"

                        call.success([
                            "uuid": messageUUID,
                        ])
                    case .active:
                        status = "ACTIVE"
                    case .inactive:
                        status = "INACTIVE"

                        self.doUnpublish(messageUUID)

                        self.notifyListeners("onPublishExpired", data: [
                            "uuid": messageUUID,
                        ])
                    case .none:
                        fallthrough
                    @unknown default:
                        status = "UNKNOWN"

                        call.error("Unknown operation status")
                    }

                    self.notifyListeners("onPublishStatusChanged", data: [
                        "uuid": messageUUID,
                        "status": status,
                    ])
                }

                /*
                 params.permissionRequestHandler = {
                 // Block type used for passing the permission state.
                 (permissionHandler: GNSPermissionHandler!) -> Void in

                 permissionHandler(true)
                 }
                 */
            }

            DispatchQueue.main.async {
                guard let publication = self.doPublish(message, paramsBlock) else {
                    call.error(Constants.PUBLISH_ERROR)
                    return
                }

                self.publications[messageUUID] = MessageOptions(
                    publication: publication,
                    message: message,
                    options: paramsBlock
                )
            }
        } catch let e {
            call.error(e.localizedDescription, e)
        }
    }

    func doPublish(_ message: GNSMessage?, _ options: GNSPublicationParamsBlock?) -> GNSPublication? {
        guard let messageManager = self.messageManager else {
            return nil
        }

        // Publishes a message with additional parameters.
        return messageManager.publication(
            // The message to publish
            with: message,

            // Use this block to pass additional parameters
            paramsBlock: options
        )
    }

    @objc func unpublish(_ call: CAPPluginCall) {
        if self.messageManager == nil {
            call.reject(Constants.NOT_INITIALIZED)
            return
        }

        do {
            if let uuid = call.getString("uuid") {
                guard let messageUUID = UUID.init(uuidString: uuid)?.uuidString else {
                    call.reject(Constants.MESSAGE_UUID_INVALID)
                    return
                }

                guard self.publications.keys.contains(messageUUID) else {
                    call.reject(Constants.MESSAGE_UUID_NOT_FOUND);
                    return;
                }

                // Unpublish message.
                doUnpublish(messageUUID)
            } else {
                // Unpublish all messages.
                for (messageUUID, _) in self.publications {
                    doUnpublish(messageUUID)
                }
            }

            call.success()
        } catch let e {
            call.error(e.localizedDescription, e)
        }
    }

    func doUnpublish(_ messageUUID: String) {
        guard var messageOptions = self.publications[messageUUID] else {
            return
        }

        doUnpublish(&messageOptions)

        messageOptions.message = nil
        messageOptions.options = nil

        self.publications.removeValue(forKey: messageUUID)
    }
    func doUnpublish(_ messageOptions: inout MessageOptions) {
        // When the publication object is deallocated, the message will no longer be published.
        messageOptions.publication = nil
    }

    @objc func subscribe(_ call: CAPPluginCall) {
        if self.messageManager == nil {
            call.reject(Constants.NOT_INITIALIZED)
            return
        }

        // The strategy to use to detect nearby devices.
        var strategy: GNSStrategy?
        // The strategy to use to scan for beacons.
        var beaconStrategy: GNSBeaconStrategy?

        // The message namespace to match.
        var namespace: String?
        // The message type to match.
        var type: String?

        if let optionsObject = call.getObject("options") {
            var lowPowerPreferred: Bool?
            var includeIBeacons: Bool?

            if let filterObject = optionsObject["filter"] as! [String : Any]? {
                if let _ = filterObject["includeEddystoneUids"] as! [String : Any]? {
                    lowPowerPreferred = true
                }

                if let _ = filterObject["includeIBeaconIds"] as! [String : Any]? {
                    includeIBeacons = true
                }

                if let includeNamespacedType = filterObject["includeNamespacedType"] as! [String : Any]? {
                    namespace = includeNamespacedType["namespace"] as? String
                    type = includeNamespacedType["type"] as? String
                }
            }

            if let strategyObject = optionsObject["strategy"] as! [String : Any]? {
                if strategyObject["DEFAULT"] as? Bool == true {
                    strategy = GNSStrategy()
                } else if strategyObject["BLE_ONLY"] as? Bool == true {
                    // Optional params for a strategy.
                    let paramsBlock = {
                        (params: GNSBeaconStrategyParams!) -> Void in

                        if (lowPowerPreferred != nil) {
                            // Low power mode is available when scanning for Eddystone beacons only; it is ignored when iBeacons are included.
                            params.lowPowerPreferred = lowPowerPreferred!
                        }

                        if (includeIBeacons != nil) {
                            // Scan also for nearby iBeacons.
                            params.includeIBeacons = includeIBeacons!
                        }

                        // Try to use the discovery strategy when the app is in the background.
                        params.allowInBackground = true
                    }

                    beaconStrategy = GNSBeaconStrategy(paramsBlock: paramsBlock)
                } else {
                    // Optional params for a strategy.
                    let paramsBlock = {
                        (params: GNSStrategyParams!) -> Void in

                        if let discoveryMode = optionsObject["discoveryMode"] {
                            // For nearby device discovery, one device must broadcast a pairing code and the other device must scan for pairing codes.
                            // default: To discover which devices are nearby, broadcast a pairing code and scan for other devices' pairing codes.
                            // scan: To discover which devices are nearby, scan for other devices' pairing codes. This is useful for scenarios where the pairing device is guaranteed only to broadcast.
                            // broadcast: To discover which devices are nearby, broadcast a pairing code for others to scan. This is useful for scenarios where the pairing device is guaranteed only to scan.
                            params.discoveryMode = GNSDiscoveryMode(rawValue: discoveryMode as! Int)
                        }

                        if let distanceType = optionsObject["distanceType"] {
                            // Controls which mediums to use to broadcast and scan pairing codes when discovering nearby devices.
                            // default: Let Nearby decide which mediums are used to discover nearby devices.
                            // audio: Use near-ultrasonic audio to discover nearby devices.
                            params.discoveryMediums = GNSDiscoveryMediums(rawValue: distanceType as! Int)
                        }

                        // Try to use the discovery strategy when the app is in the background.
                        params.allowInBackground = true
                    }

                    strategy = GNSStrategy(paramsBlock: paramsBlock)
                }
            }
        }

        do {
            let paramsBlock = {
                // Optional parameters for a subscription.
                (params: GNSSubscriptionParams!) -> Void in

                if (beaconStrategy != nil) {
                    // The types of devices to discover.
                    params.deviceTypesToDiscover = GNSDeviceTypes.bleBeacon

                    // The strategy to use for beacon scanning.
                    params.beaconStrategy = beaconStrategy
                } else {
                    // The types of devices to discover.
                    params.deviceTypesToDiscover = GNSDeviceTypes.usingNearby

                    // The strategy to use for discovering Nearby devices (non-beacons).
                    params.strategy = strategy
                }

                // The message namespace to match.
                params.messageNamespace = namespace

                // The message type to match.
                params.type = type

                // A handler for subscription status.
                params.statusHandler = {
                    // Status of an operation (publication or subscription).
                    (operationStatus: GNSOperationStatus!) -> Void in
                    var status: String

                    switch operationStatus {
                    case .starting:
                        status = "STARTING"

                        call.success()
                    case .active:
                        status = "ACTIVE"
                    case .inactive:
                        status = "INACTIVE"

                        self.doUnsubscribe()

                        self.notifyListeners("onSubscribeExpired", data: nil)
                    case .none:
                        fallthrough
                    @unknown default:
                        status = "UNKNOWN"

                        call.error("Unknown operation status")
                    }

                    self.notifyListeners("onSubscribeStatusChanged", data: [
                        "status": status,
                    ])
                }

                /*
                 params.permissionRequestHandler = {
                 // Block type used for passing the permission state.
                 (permissionHandler: GNSPermissionHandler!) -> Void in

                 permissionHandler(true)
                 }
                 */
            }

            DispatchQueue.main.async {
                self.subscriptionOptions = paramsBlock
                self.subscription = self.doSubscribe()
            }
        } catch let e {
            call.error(e.localizedDescription, e)
        }
    }

    func doSubscribe() -> GNSSubscription? {
        guard let messageManager = self.messageManager else {
            return nil
        }

        // Subscribes to all messages published by your app.
        return messageManager.subscription(
            // Block that's called when a new message is discovered
            messageFoundHandler: {
                // A message is a published object that is delivered between nearby devices.
                (message: GNSMessage?) -> Void in
                guard let message = message else { return }

                self.notifyListeners("onFound", data: [
                    "message": [
                        "type": message.type,
                        "content": message.content.base64EncodedString(),
                        "namespace": message.messageNamespace,
                    ],
                ])
        },
            // Block that's called when a previously discovered message is lost
            messageLostHandler: {
                // A message is a published object that is delivered between nearby devices.
                (message: GNSMessage?) -> Void in
                guard let message = message else { return }

                self.notifyListeners("onLost", data: [
                    "message": [
                        "type": message.type,
                        "content": message.content.base64EncodedString(),
                        "namespace": message.messageNamespace,
                    ],
                ])
        },
            // Use this block to pass additional parameters
            paramsBlock: self.subscriptionOptions
        )
    }

    @objc func unsubscribe(_ call: CAPPluginCall) {
        if self.messageManager == nil {
            call.reject(Constants.NOT_INITIALIZED)
            return
        }

        do {
            doUnsubscribe()

            self.subscriptionOptions = nil

            call.success()
        } catch let e {
            call.error(e.localizedDescription, e)
        }
    }

    func doUnsubscribe() {
        // When the subscription object is deallocated, message delivery will cease.
        self.subscription = nil
    }

    @objc func pause(_ call: CAPPluginCall) {
        if self.messageManager == nil {
            call.reject(Constants.NOT_INITIALIZED)
            return
        }

        do {
            for (_, var messageOptions) in self.publications {
                doUnpublish(&messageOptions)
            }

            doUnsubscribe()

            call.success()
        } catch let e {
            call.error(e.localizedDescription, e)
        }
    }
    @objc func resume(_ call: CAPPluginCall) {
        if self.messageManager == nil {
            call.reject(Constants.NOT_INITIALIZED)
            return
        }

        do {
            for (_, var messageOptions) in self.publications {
                messageOptions.publication = doPublish(messageOptions.message, messageOptions.options)
            }

            self.subscription = doSubscribe()

            call.success()
        } catch let e {
            call.error(e.localizedDescription, e)
        }
    }

    @objc func status(_ call: CAPPluginCall) {
        do {
            let isPublishing = (self.publications.count > 0)
            let isSubscribing = (self.subscription != nil)

            let uuids = Array(self.publications.keys)

            call.success([
                "isPublishing": isPublishing,
                "isSubscribing": isSubscribing,
                "uuids": uuids,
            ])
        } catch let e {
            call.error(e.localizedDescription, e)
        }
    }
}
