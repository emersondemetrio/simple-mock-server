// RENAME THIS FILE TO server.js

const fastify = require('fastify')({ logger: true, exposeHeadRoutes: true });
const path = require('path');
const fs = require('fs');
const cors = require('@fastify/cors');
const crypto = require('crypto');

const JSON_PATH = './public/list.json';

const ROUTES = {
	list: '/api/v1/list/',
	get: '/api/v1/get/:id',
	update: '/api/v1/update/:id',
	create: '/api/v1/create/',
};

const ORIGIN = 'http://localhost:3000'; // your FE app here

fastify.register(cors, {});

fastify.register(require('@fastify/static'), {
	root: path.join(__dirname, 'public'),
	prefix: '/public/',
});

const getAllMockData = () => {
	const data = fs.readFileSync(JSON_PATH, 'utf-8');

	return JSON.parse(data);
};

const updateAllElementsWith = (newData) => {
	fs.writeFileSync(JSON_PATH, JSON.stringify(newData, null, 4));

	return getAllMockData();
};

const getSingleElementOf = (uuid) => {
	const data = getAllMockData();
	const response = data.find((a) => a.uuid === uuid);

	return response;
};

const addElement = (element) => {
	const data = getAllMockData();
	data.push(element);

	updateAllElementsWith(data);

	return getAllMockData();
};

const updateSingleElementWith = (newData) => {
	const elementId = newData.uuid;

	const mockData = getAllMockData();
	const elementIndex = mockData.findIndex((data) => data.uuid === elementId);

	mockData[elementIndex] = {
		...mockData[elementIndex],
		...newData,
	};

	updateAllElementsWith(mockData);

	return getSingleElementOf(elementId);
};

// ROUTES list, post, put, get

fastify.get(ROUTES.list, async (_, reply) => {
	reply.header('Access-Control-Allow-Origin', 'http://localhost:8080');
	reply.header('Access-Control-Allow-Credentials', true);
	reply.header('Access-Control-Allow-Methods', 'GET');

	const data = getAllMockData();

	reply.send({
		data,
	});
});

fastify.post(ROUTES.create, (request, reply) => {
	reply.header('Access-Control-Allow-Origin', '*');
	reply.header('Access-Control-Allow-Credentials', true);

	const newElement = {
		...request.body,
		uuid: crypto.randomUUID(),
	};

	const newData = addElement(newElement);

	reply.send({
		data: newData,
	});
});

fastify.put(ROUTES.update, (request, reply) => {
	reply.header('Access-Control-Allow-Origin', '*');
	reply.header('Access-Control-Allow-Credentials', true);

	const updated = updateSingleElementWith(request.body);

	reply.send({
		data: updated,
	});
});

fastify.get(ROUTES.get, async (request, reply) => {
	reply.header('Access-Control-Allow-Origin', 'http://localhost:8080');
	reply.header('Access-Control-Allow-Credentials', true);
	reply.header('Access-Control-Allow-Methods', 'GET');

	const data = getSingleElementOf(request.params.id);

	reply.send({
		data,
	});
});

// RUN the server

fastify.listen({ port: 3000 }, (err, address) => {
	if (err) throw err;
});
