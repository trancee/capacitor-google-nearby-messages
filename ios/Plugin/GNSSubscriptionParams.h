#import "GNSOperationStatus.h"
#import "GNSPermission.h"

@class GNSBeaconStrategy;
@class GNSStrategy;

/// Device type.  These values can be ORed together.
typedef NS_OPTIONS(NSInteger, GNSDeviceTypes) {
  /// Device using the Nearby protocol.
  kGNSDeviceUsingNearby = 1 << 0,

  /// Beacon.
  kGNSDeviceBLEBeacon = 1 << 1,
};

/// Optional parameters for a subscription. See the property declarations below for explanations of
/// each parameter.
@interface GNSSubscriptionParams : NSObject<NSCopying>

/// The types of devices to discover.
/// The default is @c kGNSDeviceUsingNearby.
@property(nonatomic) GNSDeviceTypes deviceTypesToDiscover;

/// The message namespace to match. The empty string is the default namespace, and is private
/// to each app (or apps sharing a Google Developer Console project).
@property(nonatomic, copy) NSString *messageNamespace;

/// The message type to match. Must not be nil. The empty string is the default type.
@property(nonatomic, copy) NSString *type;

/// The strategy to use for discovering Nearby devices (non-beacons).
@property(nonatomic, copy) GNSStrategy *strategy;

/// The strategy to use for beacon scanning.
@property(nonatomic, copy) GNSBeaconStrategy *beaconStrategy;

/// A handler for subscription status.  It can be used for tracking the status of a newly created
/// subscription.
@property(nonatomic, copy) GNSOperationStatusHandler statusHandler;

/// A handler for requesting user permission to use Nearby.  This handler overrides the default
/// dialog used by Nearby; if you supply this handler, Nearby will not show its permission dialog.
///
/// In your request handler, you should request the user's permission to perform the task that
/// requires the use of Nearby, explaining why it's being used.  When the user has given or denied
/// consent, you must call the block that's passed into your request handler.  If you pass @c YES
/// into the block, it means the user has consented to allow Nearby to function.  If you pass @c NO,
/// it means the user has not consented; your publications and subscriptions will not work until
/// consent has been given.
///
/// The handler can also be used as a method of "preflighting" for the iOS permission dialogs.  You
/// can use it to explain why the user is expected to consent to the iOS permissions before your
/// app can perform its Nearby related functions.
@property(nonatomic, copy) GNSPermissionRequestHandler permissionRequestHandler;

@end
