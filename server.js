const express = require('express');
const { conn, Person, Place, Thing, Souvenir, syncAndSeed } = require('./db');
const app = express();
app.use(require('method-override')('_method'));
app.use(express.urlencoded({ extended: false }));

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
														return `<li>${souvenir.person.name} purchased a ${souvenir.thing.name} in ${souvenir.place.name} <form method='POST' action='/${souvenir.id}?_method=DELETE'>
                                                        <button>
                                                        Delete 
                                                        </button>
                                                      </form></li>`;
													})
													.join('')}
                    </ul>
            </div>
            <div>
                <form method='POST' action='/'>
                    <select name='personId'>
                    ${persons
											.map((person) => {
												return `
                            <option value=${person.id}>
                            ${person.name}
                            </option>
                        `;
											})
											.join('')}
                    </select>
                    <select name='placeId'>
                    ${places
											.map((place) => {
												return `
                            <option value=${place.id}>
                            ${place.name}
                            </option>
                        `;
											})
											.join('')}
                    </select>
                    <select name='thingId'>
                    ${things
											.map((thing) => {
												return `
                            <option value=${thing.id}>
                            ${thing.name}
                            </option>
                        `;
											})
											.join('')}
                    </select>
                    
                    <button>Create</button>
                </form>
            </div>
            </body>
        </html>
        `);
	} catch (error) {
		next(error);
	}
});

app.post('/', async (req, res, next) => {
	try {
		await Souvenir.create(req.body);
		res.redirect('/');
	} catch (error) {
		next(error);
	}
});

app.delete('/:id', async (req, res, next) => {
	try {
		const souvenirDead = await Souvenir.findByPk(req.params.id);
		await souvenirDead.destroy();
		res.redirect('/');
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
