/// Status of an operation (publication or subscription).
typedef NS_ENUM(NSUInteger, GNSOperationStatus) {
  /// Operation is inactive
  kGNSOperationStatusInactive,
  /// Operation is starting but is not yet active
  kGNSOperationStatusStarting,
  /// Operation is active
  kGNSOperationStatusActive,
};

/// A handler block for receiving operation status.
typedef void (^GNSOperationStatusHandler)(GNSOperationStatus);
