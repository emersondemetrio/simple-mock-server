// RENAME THIS FILE TO server.js

const fastify = require('fastify')({ logger: true, exposeHeadRoutes: true });
const path = require('path');
const fs = require('fs');
const cors = require('@fastify/cors');
const crypto = require('crypto');

const JSON_PATH = './public/locations.json';

const ROUTES = {
	ll: '/api/live_location/push_location',
	get: '/api/live_location/get_location',
};

const ORIGIN = 'http://localhost:8080';

fastify.register(cors, {});

fastify.register(require('@fastify/static'), {
	root: path.join(__dirname, 'public'),
	prefix: '/public/',
});

// const emitLastPositionViaSocket = (data) => {
// 	const io = require('socket.io')(fastify.server);
// 	io.on('connection', (socket) => {
// 		socket.emit('last_position', data);
// 	});
// };

fastify.get(ROUTES.get, (request, reply) => {
	reply.header('Access-Control-Allow-Origin', '*');
	reply.header('Access-Control-Allow-Credentials', true);
	reply.header('Access-Control-Allow-Methods', 'GET');
	reply.header('Access-Control-Allow-Headers', 'Content-Type');

	const data = fs.readFileSync(JSON_PATH, 'utf-8');
	reply.send(JSON.parse(data));
});

fastify.post(ROUTES.ll, (request, reply) => {
	reply.header('Access-Control-Allow-Origin', '*');
	reply.header('Access-Control-Allow-Credentials', true);
	reply.header('Access-Control-Allow-Methods', 'POST');
	reply.header('Access-Control-Allow-Headers', 'Content-Type');

	console.log(
		`

==>

`,
		'Got position',
		new Date(),
		request.body,
		`


		`
	);

	fs.writeFileSync(JSON_PATH, JSON.stringify(request.body, null, 2));
	// emitLastPositionViaSocket(request.body);

	reply.send({
		data: {
			status: 'ok',

			originalData: request.body,
		},
	});
});

fastify.listen({ port: 3000 }, (err, address) => {
	if (err) throw err;
});
