import { Server } from "http";
import app from "./app";
import config from "./config";
import "module-alias/register"



async function main() {

	const server: Server = app.listen(config.port, () => {
		console.log(`Backend Server Running on Port:${config.port}`);
	});

	const exitHandler = () => {
		if (server) {
			server.close(() => {
				console.info("Server close !");
			});
		};
		process.exit(1);
	};

	process.on("uncaughtException", (error) => {
		console.log(error);
		exitHandler();
	});

	process.on("unhandledRejection", (error) => {
		console.log(error);
		exitHandler();
	});
};

main();