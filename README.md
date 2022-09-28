# simple-mock-server

1 - Copy/Rename the file `server.example.js` to `server.js`

2 - `yarn (or npm install)`

3 - Change the var `ORIGIN` to your FE app url, usually `http://localhost:SOME_PORT`

4 - `yarn start (or npm start)`

## Available routes:

```js
const ROUTES = {
	list: '/api/v1/list/',
	get: '/api/v1/get/:id',
	update: '/api/v1/update/:id',
	create: '/api/v1/create/',
};
```
