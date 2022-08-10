const Sequelize = require('sequelize');
const { STRING, INTEGER } = Sequelize;
const conn = new Sequelize(
	process.env.DATABASE_URL || 'postgres://localhost/acme_people_places_things'
);

const Person = conn.define('person', {
	name: {
		type: STRING,
		allowNull: false,
		validate: {
			notEmpty: true,
		},
		unique: true,
	},
});

const Place = conn.define('place', {
	name: {
		type: STRING,
		allowNull: false,
		validate: {
			notEmpty: true,
		},
		unique: true,
	},
});

const Thing = conn.define('thing', {
	name: {
		type: STRING,
		allowNull: false,
		validate: {
			notEmpty: true,
		},
		unique: true,
	},
});

const Souvenir = conn.define('souvenir', {});

Souvenir.belongsTo(Person);
Souvenir.belongsTo(Place);
Souvenir.belongsTo(Thing);
Person.hasMany(Souvenir);
Place.hasMany(Souvenir);
Thing.hasMany(Souvenir);

const syncAndSeed = async () => {
	try {
		await conn.sync({ force: true });
		const [moe, larry, lucy, ethyl] = await Promise.all([
			Person.create({ name: 'moe' }),
			Person.create({ name: 'larry' }),
			Person.create({ name: 'lucy' }),
			Person.create({ name: 'ethyl' }),
		]);
		const [paris, nyc, chicago, london] = await Promise.all([
			Place.create({ name: 'Paris' }),
			Place.create({ name: 'NYC' }),
			Place.create({ name: 'Chicago' }),
			Place.create({ name: 'London' }),
		]);
		const [hat, bag, shirt, cup] = await Promise.all([
			Thing.create({ name: 'hat' }),
			Thing.create({ name: 'bag' }),
			Thing.create({ name: 'shirt' }),
			Thing.create({ name: 'cup' }),
		]);
		await Promise.all([
			Souvenir.create({ personId: 1, placeId: 1, thingId: 1 }),
			Souvenir.create({ personId: 1, placeId: 3, thingId: 4 }),
			Souvenir.create({ personId: 4, placeId: 2, thingId: 2 }),
			Souvenir.create({ personId: 3, placeId: 4, thingId: 3 }),
		]);
	} catch (error) {
		next(error);
	}
};

module.exports = {
	conn,
	Person,
	Place,
	Thing,
	Souvenir,
	syncAndSeed,
};
