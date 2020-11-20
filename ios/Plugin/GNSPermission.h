/// Block type used for passing the permission state.
/// @param granted Whether Nearby permission is currently granted.
typedef void (^GNSPermissionHandler)(BOOL granted);

/// Block type for requesting user permission to use Nearby.
/// @param permissionHandler Handler into which the permission is passed.
typedef void (^GNSPermissionRequestHandler)(GNSPermissionHandler permissionHandler);

/// This class lets you manage the Nearby permission state for the app on the current device.
///
/// The user must grant permission before publications and subscriptions will work.  The first
/// time the application creates a publication or subscription, the Nearby permission dialog is
/// automatically displayed, giving the user the opportunity to opt in.  If the user denies, an
/// alert will be displayed each time a publication or subscription is subsequently created, giving
/// them another chance to opt in.
///
/// It is recommended that your app provide the user a method for switching the permission on or
/// off; for instance, by using a toggle switch in a settings page.  When the user toggles it, the
/// app should call the \c isGranted and \c setGranted methods below to toggle the permission state.
///
/// To track the permission state, create a \c GNSPermission object and pass in a changed handler.
/// The handler will be called whenever the permission state is changed, allowing your app's UI to
/// be kept in sync with the current state.
@interface GNSPermission : NSObject

/// Initializes the permission object with a handler that is called whenever the permission state
/// changes.  The handler lets the app keep its UI in sync with the permission state.  The handler
/// is not called until the user has approved or denied permission.
/// @param handler The permission granted handler
- (instancetype)initWithChangedHandler:(GNSPermissionHandler)changedHandler;

/// Whether Nearby permission is currently granted for the app on this device.  YES means the user
/// has granted Nearby permission, and NO means the user has denied permission.  If permission has
/// not been granted, publications and subscriptions will not work.
+ (BOOL)isGranted;

/// Changes the Nearby permission state.  This should be called only in response to the user action
/// of changing the permission state.
+ (void)setGranted:(BOOL)granted;

@end
