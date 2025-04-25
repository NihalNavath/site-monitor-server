import { Wsmt } from "website-monitor-tool"
import PushNotifier from "node-pushnotifier";
import { configDotenv } from "dotenv";
import axios from "axios"

configDotenv()

const instance = new PushNotifier.default({
	api_token: process.env.PUSH_NOTIFICATION_SERVICE_TOKEN,
	package: process.env.PUSH_NOTIFICATION_PACKAGE_NAME,
});

const username = process.env.PUSH_NOTIFICATION_USERNAME;
const password = process.env.PUSH_NOTIFICATION_PASSWORD;

const wsmtPassword = process.env.WSMT_PASSWORD
const DISCORD_WEBHOOK_URL = process.env.DISCORD_WEBHOOK_URL

const wsmt = new Wsmt({
	port: 7621,
	password: wsmtPassword,
	webServerOptions: {
		enabled: true,
		port: 1010
	},
	callback: (name) => {
		const message = `${name} just went down!`
		sendNotificationToAllDevices(message)
	}
});
wsmt.init();

console.log('Mothership listening on port 7621');


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

	const embed = {
		title: message,
		color: 0x3498db,
		timestamp: new Date(),
		footer: {
			text: "Powered by WSMT",
		},
	};

	axios
		.post(DISCORD_WEBHOOK_URL, {
			content: "<@&658929823111970816>",
			embeds: [embed],
		})
		.then(() => {
			console.log('%cMessage successfully sent to Discord webhook! 🎉', 'color: green; font-weight: bold;');
		})
		.catch((err) => {
			console.error('%cDiscord webhook failed 😞:', 'color: red; font-weight: bold;', err);
		});

};