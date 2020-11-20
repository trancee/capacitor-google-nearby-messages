/// Optional params for a beacon strategy. See properties with the same names in GNSBeaconStrategy.
@interface GNSBeaconStrategyParams : NSObject
@property(nonatomic) BOOL includeIBeacons;
@property(nonatomic) BOOL allowInBackground;
@property(nonatomic) BOOL lowPowerPreferred;
@end

/// The strategy to use to scan for beacons.
@interface GNSBeaconStrategy : NSObject<NSCopying>

/// Scan also for nearby iBeacons.
///
/// The default is @c YES. Scanning for iBeacons triggers a location permission dialog from iOS, so
/// you should set this to @c NO if you don't want to scan for iBeacons.
@property(nonatomic, readonly) BOOL includeIBeacons;

/// Try to scan for beacons when the app is in the background.
///
/// The default is @c NO.
@property(nonatomic, readonly) BOOL allowInBackground;

/// Low power mode is available when scanning for Eddystone beacons only; it is ignored when
/// iBeacons are included.  Turn off low power mode if you prefer lower latency scanning, at a
/// higher battery cost.
///
/// The default is @c YES.
@property(nonatomic, readonly) BOOL lowPowerPreferred;

/// Returns the default strategy, which uses the default values for all properties.
+ (instancetype)strategy;

/// Returns a custom strategy.  You can set any of the optional properties in @c paramsBlock.
+ (instancetype)strategyWithParamsBlock:(void (^)(GNSBeaconStrategyParams *))paramsBlock;

@end
