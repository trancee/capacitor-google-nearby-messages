#import "GNSOperationStatus.h"
#import "GNSPermission.h"

@class GNSStrategy;

/// Optional parameters for a publication. See the property declarations below for explanations of
/// each parameter.
@interface GNSPublicationParams : NSObject<NSCopying>

/// The strategy to use for publishing the message.  See @c GNSStrategy for the default.
@property(nonatomic, copy) GNSStrategy *strategy;

/// A handler for publication status.  It can be used for tracking the status of a newly created
/// publication.
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
