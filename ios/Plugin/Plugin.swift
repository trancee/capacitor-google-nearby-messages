import Foundation
import Capacitor

/**
 * Please read the Capacitor iOS Plugin Development Guide
 * here: https://capacitor.ionicframework.com/docs/plugins/ios
 */
@objc(GoogleNearbyMessages)
public class GoogleNearbyMessages: CAPPlugin {
    /**
     * @property
     * The message manager lets you create publications and subscriptions.  They are valid only as long
     * as the manager exists.
     */
    var messageManager: GNSMessageManager?
    var nearbyPermission: GNSPermission?
    var publication: GNSPublication?
    var subscription: GNSSubscription?
    
    @objc func initialize(_ call: CAPPluginCall) {
        let apiKey = call.getString("apiKey") ?? ""
        
        publication = nil
        subscription = nil
        
        // Enable debug logging to help track down problems.
        GNSMessageManager.setDebugLoggingEnabled(true)
        
        // Create the message manager, which lets you publish messages and subscribe to messages
        // published by nearby devices.
        messageManager = GNSMessageManager(
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
                        print("Nearby works better if microphone use is allowed")
                    }
                }
                // Bluetooth permission is denied.
                params.bluetoothPermissionErrorHandler = { (hasError: Bool) in
                    if (hasError) {
                        print("Nearby works better if Bluetooth use is allowed")
                    }
                }
                // Bluetooth is powered off.
                params.bluetoothPowerErrorHandler = { (hasError: Bool) in
                    if (hasError) {
                        print("Nearby works better if Bluetooth is turned on")
                    }
                }
                
                // This parameter is relevant only if your app uses the audio medium for discovery.
                params.shouldUseBestAudioSessionCategory = true
        })
        
        // Initializes the permission object with a handler that is called whenever the permission state changes.
        nearbyPermission = GNSPermission(
            // The permission granted handler
            changedHandler: {
                (granted: Bool) in
                self.notifyListeners("onPermissionChanged", data: [
                    "permissionGranted": granted
                ])
        })
    }
    
    @objc func publish(_ call: CAPPluginCall) {
        guard let messageManager = messageManager else {
            call.reject("Message manager not ready.")
            return
        }

        let content = call.getString("content") ?? ""
        
        // A message is a published object that is delivered between nearby devices.
        let message = GNSMessage(content: content.data(using: .utf8))
        
        // Publishes a message with additional parameters.
        publication = messageManager.publication(
            // The message to publish
            with: message,
            // Use this block to pass additional parameters
            paramsBlock: {
                // Optional parameters for a publication.
                (params: GNSPublicationParams?) -> Void in
                guard let params = params else { return }

                // The strategy to use for publishing the message.
                params.strategy = GNSStrategy(
                    // Returns a custom strategy.
                    paramsBlock: {
                        // Optional params for a strategy.
                        (params: GNSStrategyParams?) -> Void in
                        guard let params = params else { return }
                        
                        // For nearby device discovery, one device must broadcast a pairing code and the other device must scan for pairing codes.
                        // default: To discover which devices are nearby, broadcast a pairing code and scan for other devices' pairing codes.
                        // scan: To discover which devices are nearby, scan for other devices' pairing codes. This is useful for scenarios where the pairing device is guaranteed only to broadcast.
                        // broadcast: To discover which devices are nearby, broadcast a pairing code for others to scan. This is useful for scenarios where the pairing device is guaranteed only to scan.
                        params.discoveryMode = .default
                        
                        // Controls which mediums to use to broadcast and scan pairing codes when discovering nearby devices.
                        // default: Let Nearby decide which mediums are used to discover nearby devices.
                        // audio: Use near-ultrasonic audio to discover nearby devices.
                        // BLE: Use Bluetooth Low Energy to discover nearby devices.
                        params.discoveryMediums = .default
                        
                        // Try to use the discovery strategy when the app is in the background.
                        params.allowInBackground = true
                })

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

                        self.notifyListeners("onPublishExpired", data: nil)
                    case .none:
                        fallthrough
                    @unknown default:
                        status = "UNKNOWN"

                        call.error("Unknown publish operation status.")
                    }
                    
                    self.notifyListeners("onPublishStatusChanged", data: [
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
        )
    }
    
    @objc func unpublish(_ call: CAPPluginCall) {
        publication = nil

        call.success()
    }
    
    @objc func subscribe(_ call: CAPPluginCall) {
        guard let messageManager = messageManager else {
            call.reject("Message manager not ready.")
            return
        }

        // Subscribes to all messages published by your app.
        subscription = messageManager.subscription(
            // Block that's called when a new message is discovered
            messageFoundHandler: {
                // A message is a published object that is delivered between nearby devices.
                (message: GNSMessage?) -> Void in
                guard let message = message else { return }
                
                self.notifyListeners("onFound", data: [
                    "message": [
                        "type": message.type,
                        "content": String(data: message.content, encoding:.utf8) ?? "",
                        "namespace": message.messageNamespace,
                    ]
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
                        "content": String(data: message.content, encoding:.utf8) ?? "",
                        "namespace": message.messageNamespace,
                    ]
                ])
        },
            // Use this block to pass additional parameters
            paramsBlock: {
                // Optional parameters for a subscription.
                (params: GNSSubscriptionParams?) -> Void in
                guard let params = params else { return }

                /*
                // The types of devices to discover.
                params.deviceTypesToDiscover = GNSDeviceTypes.usingNearby
                */
                
                /*
                // The message namespace to match.
                params.messageNamespace = namespace
                */
                
                /*
                // The message type to match.
                params.type = type
                */
                
                // The strategy to use for discovering Nearby devices (non-beacons).
                params.strategy = GNSStrategy(
                    // Returns a custom strategy.
                    paramsBlock: {
                        // Optional params for a strategy.
                        (params: GNSStrategyParams?) -> Void in
                        guard let params = params else { return }
                        
                        // For nearby device discovery, one device must broadcast a pairing code and the other device must scan for pairing codes.
                        // default: To discover which devices are nearby, broadcast a pairing code and scan for other devices' pairing codes.
                        // scan: To discover which devices are nearby, scan for other devices' pairing codes. This is useful for scenarios where the pairing device is guaranteed only to broadcast.
                        // broadcast: To discover which devices are nearby, broadcast a pairing code for others to scan. This is useful for scenarios where the pairing device is guaranteed only to scan.
                        params.discoveryMode = .default
                        
                        // Controls which mediums to use to broadcast and scan pairing codes when discovering nearby devices.
                        // default: Let Nearby decide which mediums are used to discover nearby devices.
                        // audio: Use near-ultrasonic audio to discover nearby devices.
                        // BLE: Use Bluetooth Low Energy to discover nearby devices.
                        params.discoveryMediums = .default
                        
                        // Try to use the discovery strategy when the app is in the background.
                        params.allowInBackground = true
                })
                
                /*
                // The strategy to use for beacon scanning.
                params.beaconStrategy = GNSBeaconStrategy()
                */
                
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
                        
                        self.notifyListeners("onSubscribeExpired", data: nil)
                    case .none:
                        fallthrough
                    @unknown default:
                        status = "UNKNOWN"
                        
                        call.error("Unknown publish operation status.")
                    }
                    
                    self.notifyListeners("onSubscribeStatusChanged", data: [
                        "status": status,
                    ])
                }
                
                /*
                // A handler for subscription status.
                params.permissionRequestHandler = {
                    // Block type used for passing the permission state.
                    (permissionHandler: GNSPermissionHandler!) -> Void in
                    permissionHandler(true)
                }
                */
        })
    }

    @objc func unsubscribe(_ call: CAPPluginCall) {
        subscription = nil

        call.success()
    }
    
    @objc func pause(_ call: CAPPluginCall) {
        // Changes the Nearby permission state.
        GNSPermission.setGranted(false)
        
        call.success()
    }
    @objc func resume(_ call: CAPPluginCall) {
        // Changes the Nearby permission state.
        GNSPermission.setGranted(true)
        
        call.success()
    }

    @objc func isGranted(_ call: CAPPluginCall) {
        // Whether Nearby permission is currently granted for the app on this device.
        call.success([
            "isGranted": GNSPermission.isGranted()
        ])
    }
    
    @objc func status(_ call: CAPPluginCall) {
        call.success([
            "isPublishing": publication != nil,
            "isSubscribing": subscription != nil,
        ])
    }
}
