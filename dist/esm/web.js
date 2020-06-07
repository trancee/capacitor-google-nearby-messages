var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { WebPlugin } from '@capacitor/core';
export class GoogleNearbyMessagesWeb extends WebPlugin {
    constructor() {
        super({
            name: 'GoogleNearbyMessages',
            platforms: ['web']
        });
    }
    initialize() {
        return __awaiter(this, void 0, void 0, function* () {
            console.log("initialize");
            throw new Error("Method not implemented.");
        });
    }
    // Publishes a message so that it is visible to nearby devices, using the default options from DEFAULT.
    publish(options) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log("publish", options);
            throw new Error("Method not implemented.");
        });
    }
    // Cancels an existing published message.
    unpublish(options) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log("unpublish", options);
            throw new Error("Method not implemented.");
        });
    }
    // Subscribes for published messages from nearby devices, using the default options in DEFAULT.
    subscribe(options) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log("subscribe", options);
            throw new Error("Method not implemented.");
        });
    }
    // Cancels an existing subscription.
    unsubscribe(options) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log("unsubscribe", options);
            throw new Error("Method not implemented.");
        });
    }
    /*
    // Registers a status callback, which will be notified when significant events occur that affect Nearby for your app.
    async registerStatusCallback(options: {
      // A callback to notify when events occur
      // UNUSED // statusCallback: StatusCallback,
    }): Promise<void> {
      console.log("registerStatusCallback", options);
      throw new Error("Method not implemented.");
    }
  
    // Unregisters a status callback previously registered with registerStatusCallback(StatusCallback).
    async unregisterStatusCallback(options: {
      // A callback previously registered with registerStatusCallback(StatusCallback)
      // UNUSED // statusCallback: StatusCallback,
    }): Promise<void> {
      console.log("unregisterStatusCallback", options);
      throw new Error("Method not implemented.");
    }
    */
    pause() {
        return __awaiter(this, void 0, void 0, function* () {
            console.log("pause");
            throw new Error("Method not implemented.");
        });
    }
    resume() {
        return __awaiter(this, void 0, void 0, function* () {
            console.log("resume");
            throw new Error("Method not implemented.");
        });
    }
    status() {
        return __awaiter(this, void 0, void 0, function* () {
            console.log("status");
            throw new Error("Method not implemented.");
        });
    }
}
const GoogleNearbyMessages = new GoogleNearbyMessagesWeb();
export { GoogleNearbyMessages };
import { registerWebPlugin } from '@capacitor/core';
registerWebPlugin(GoogleNearbyMessages);
//# sourceMappingURL=web.js.map