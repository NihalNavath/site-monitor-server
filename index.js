import {Wsmt} from "website-monitor-tool"
import PushNotifier from "node-pushnotifier";
import { configDotenv } from "dotenv";

configDotenv()

const instance = new PushNotifier.default({
	api_token: process.env.PUSH_NOTIFICATION_SERVICE_TOKEN,
	package: process.env.PUSH_NOTIFICATION_PACKAGE_NAME,
});

const username = process.env.PUSH_NOTIFICATION_USERNAME;
const password = process.env.PUSH_NOTIFICATION_PASSWORD;

new Wsmt({port: 1234, password: process.env.SERVER_PASSWORD, callback: (name) => {
    const message = `${name} went offline!`
    sendNotificationToAllDevices(message)
}})

const sendNotificationToAllDevices = (message) => {
	instance
		.login(username, password)
		.then((user) => {
			// set app token for instance (or create a new one)
			instance.setAppToken(user.getAppToken());

			// iterate through devices
			instance.getDevices().then((devices) => {
                //sends a text message to all the devices registered
				instance.sendText(devices, message);
			});
		})
		.catch((error) => {
			console.log(error);
		});
};