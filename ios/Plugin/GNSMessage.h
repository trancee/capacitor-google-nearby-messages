/// The maximum size (in bytes) of the content of a GNSMessage. This is set to 100KiB (that is,
/// 100 * 1024 bytes).
extern const NSInteger kGNSMessageMaximumContentSize;

/// The maximum length of the message type, in Unicode characters.
extern const NSInteger kGNSMessageMaximumTypeLength;

/// A message is a published object that is delivered between nearby devices.  Messages are
/// delivered only between apps sharing the same Apiary Dev Console ID.
/// See https://code.google.com/apis/console/
///
/// A message also has a type, which is used to match a published message with subscriptions.  @see
/// GNSMessageManager for more information about publications and subscriptions.
@interface GNSMessage : NSObject

/// The namespace of the message type. The empty string is the default namespace, and is private
/// to each app (or apps sharing a Google Developer Console project). Note that currently, only
/// beacon attachments will have a namespace other than the default.
@property(nonatomic, copy, readonly) NSString *messageNamespace;

/// The type of the message. Cannot be longer than kGNSMessageMaximumLength Unicode characters.
/// Attempting to use a longer type will cause the library to assert if assertions are enabled and
/// not publish the message if assertions are disabled.
@property(nonatomic, copy, readonly) NSString *type;

/// The content of the message.  The format of the data is application-specific, and must be agreed
/// upon by all publishers and subscribers of the data. Cannot be longer than
/// kGNSMessageMaximumContentSize. Attempting to use an object larger than this will cause the
/// library to assert if assertions are enabled and not publish the message if assertions are
/// disabled.
@property(nonatomic, copy, readonly) NSData *content;

- (instancetype)init __attribute__((unavailable("Use +messageWithContent.")));

/// Message with the default type.
/// @see GNSMessage.content for more information about the content.
+ (instancetype)messageWithContent:(NSData *)content;

/// Message with the specified type.
/// @see GNSMessage.content for more information about the content.
/// @see GNSMessage.type for more information about the type.
+ (instancetype)messageWithContent:(NSData *)content type:(NSString *)type;

@end
