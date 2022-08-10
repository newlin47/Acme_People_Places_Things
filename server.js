const express = require('express');
const { conn, Person, Place, Thing, Souvenir, syncAndSeed } = require('./db');

const app = express();

app.get('/', async (req, res, next) => {
	try {
		const persons = await Person.findAll();
		const places = await Place.findAll();
		const things = await Thing.findAll();
		const souvenirs = await Souvenir.findAll({
			include: [Person, Place, Thing],
		});
		res.send(`
        <html>
            <head>
                <title>Acme Store</title>
            </head>
            <body>
                <h1>Acme Store</h1>
                <div>
                    <h4>People</h4>
                    <ul>
                        ${persons
													.map((person) => {
														return `<li>${person.name}</li>`;
													})
													.join('')}
                    </ul>
                </div>
                <div>
                    <h4>Places</h4>
                    <ul>
                        ${places
													.map((place) => {
														return `<li>${place.name}</li>`;
													})
													.join('')}
                    </ul>
                </div>
                <div>
                    <h4>Things</h4>
                    <ul>
                        ${things
													.map((thing) => {
														return `<li>${thing.name}</li>`;
													})
													.join('')}
                    </ul>
                </div>
                <div>
                    <h4>Souvenirs</h4>
                    <ul>
                        ${souvenirs
													.map((souvenir) => {
														return `<li>${souvenir.person.name} purchased a ${souvenir.thing.name} in ${souvenir.place.name}</li>`;
													})
													.join('')}
                    </ul>
            </div>
            </body>
        </html>
        `);
	} catch (error) {
		next(error);
	}
});

const init = async () => {
	try {
		syncAndSeed();
		const port = process.env.PORT || 3000;
		app.listen(port, () => {
			console.log(`Listening on port ${port}`);
		});
	} catch (error) {
		console.log(error);
	}
};
init();
