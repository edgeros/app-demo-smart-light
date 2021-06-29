/*
 * Copyright (c) 2021 EdgerOS Team.
 * All rights reserved.
 *
 * Detailed license information can be found in the LICENSE file.
 *
 * File: main.js.
 *
 * Author: liukai@acoinfo.com
 *
 */

/* Import system modules */
const WebApp = require('webapp');
var Socket = require('socket.io');
var Device = require('device');

/* Smart light device */
var light = undefined;

/* Smart light devices */
var lights = new Map();

/* Create App */
const app = WebApp.createApp();

/* Set static path */
app.use(WebApp.static('./public'));


/* 
 * Create socket io. 
 */
var io = new Socket(app, {
	path: '/light',
});

/* 
 * Create socket io.
 */
io.on('connection', function (sock) {
	console.info(`Client: ${sock.id} connected.`);

	sock.on('disconnect', function () {
		console.info(`client_${sock.id} disconnected.`);
	});

	sock.on('light-list', function (result) {
		let devices = [];
		lights.forEach((light) => {
			devices.push(light);
		});
		result(devices);
	});

	/*
	 * msg: id
	 */
	sock.on('light-select', function (devid, result) {
		console.log(devid);
		console.log(typeof devid);
		light = new Device();
		light.request(devid, function (error) {
			if (error) {
				result({
					result: false,
					code: 50004,
					message: `您没有此设备权限！：${error.message}`
				});
				light = undefined;

			} else {
				result({
					result: true,
					code: 20000,
					message: 'success'
				});
				light.on('lost', lightRemove);
				light.on('message', function (msg) {
					console.log(JSON.stringify(msg));
					io.emit('light-message', msg);
				});

				light.send({ query: true, attrs: ['channel0'] }, function (error) {
					if (error) {
						console.error('Query light error:', error.message);
					} else {
						console.log('Query light Ok!');
					}
				}, 3);
			}
		});
	});

	/*
	 * msg: {method, id, [params]}
	 */
	sock.on('light-control', function (msg) {
		if (light && light.devid) {
			console.log('Client send message:', JSON.stringify(msg));
			light.send(msg, function (error) {
				if (error) {
					console.error('Send message to light error:', error.message);
				}
			}, 3);
		} else {
			sockio.emit('light-error', { code: 50002, error: '无效设备!' });
		}
	});
});

/*
 * Get All Smart light device
 */
Device.list(true, function (error, list) {
	console.log(JSON.stringify(list));
	if (list) {
		list.forEach(function (dev) {
			Device.info(dev.devid, function (error, info) {
				if (info &&
					info.report.name === 'light') {
					lights.set(dev.devid, {
						devid: dev.devid, alias: dev.alias, report: info.report
					});
				}
			});
		});
	}
});

/*
 * Smart light device lost
 */
Device.on('lost', function (devid) {
	if (lights.has(devid)) {
		lights.delete(devid);
		if (light && light.devid === devid) {
			lightRemove();
		}

		io.emit('light-lost', devid);
	}
});

/*
 * Smart light device join
 */
Device.on('join', function (devid, info) {
	if (info.report.name === 'light' && info.report.model === 'port') {
		var devobj = {
			devid: devid, alias: info.alias, report: info.report
		};
		lights.set(devid, devobj);
		io.emit('light-join', devobj);
	}
});

/*
 * Smart light query statistical data
 */
setInterval(function () {
	if (light && light.devid) {
		light.send({ query: true, attrs: ['channel0'] });
	}
}, 5000);

/*
 * Smart light Remove
 */
function lightRemove() {
	if (light) {
		light.release();
		light.removeAllListeners();
	}
}


/* Start App */
app.start();

/* Event loop */
require('iosched').forever();
