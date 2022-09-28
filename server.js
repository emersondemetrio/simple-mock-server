const fastify = require('fastify')({ logger: true, exposeHeadRoutes: true });
const path = require('path');
const fs = require('fs');
const cors = require('@fastify/cors');

const JSON_PATH = './public/list.json';

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

fastify.get('/api/v1/edit-trip/settings/', async (_, reply) => {
	reply.header('Access-Control-Allow-Origin', 'http://localhost:8080');
	reply.header('Access-Control-Allow-Credentials', true);
	reply.header('Access-Control-Allow-Methods', 'GET');

	const data = getAllMockData();

	reply.send({
		data,
	});
});

fastify.options('/api/v1/edit-trip/settings/:id', (_, reply) => {
	reply.header('Access-Control-Allow-Origin', 'http://localhost:8080');
	reply.header('Access-Control-Allow-Credentials', true);
	reply.header('Access-Control-Allow-Methods', 'OPTIONS');
	reply.code(200).send();
});

fastify.put('/api/v1/edit-trip/settings/:id', (request, reply) => {
	reply.header('Access-Control-Allow-Origin', '*');
	reply.header('Access-Control-Allow-Credentials', true);

	const updated = updateSingleElementWith(request.body);

	reply.send({
		data: updated,
	});
});

fastify.get('/api/v1/edit-trip/settings/:id', async (request, reply) => {
	reply.header('Access-Control-Allow-Origin', 'http://localhost:8080');
	reply.header('Access-Control-Allow-Credentials', true);
	reply.header('Access-Control-Allow-Methods', 'GET');

	const data = getSingleElementOf(request.params.id);

	reply.send({
		data,
	});
});

fastify.listen({ port: 3000 }, (err, address) => {
	if (err) throw err;
});
