const db = require('../models');
const Users = db.users;

const Investments = db.investments;

const Startups = db.startups;

const Organizations = db.organizations;

const InvestmentsData = [
  {
    amount: 74.31,

    date: new Date('2024-02-18'),

    // type code here for "relation_one" field

    // type code here for "relation_one" field

    // type code here for "relation_one" field
  },

  {
    amount: 15.09,

    date: new Date('2023-09-09'),

    // type code here for "relation_one" field

    // type code here for "relation_one" field

    // type code here for "relation_one" field
  },

  {
    amount: 56.17,

    date: new Date('2023-04-19'),

    // type code here for "relation_one" field

    // type code here for "relation_one" field

    // type code here for "relation_one" field
  },

  {
    amount: 40.22,

    date: new Date('2024-01-30'),

    // type code here for "relation_one" field

    // type code here for "relation_one" field

    // type code here for "relation_one" field
  },
];

const StartupsData = [
  {
    name: 'Alfred Kinsey',

    sector: "C'mon Naomi",

    description: 'At an end your rule is, and not short enough it was!',

    // type code here for "relation_many" field

    // type code here for "relation_one" field
  },

  {
    name: 'Louis Pasteur',

    sector: 'So I was walking Oscar',

    description:
      'Pain, suffering, death I feel. Something terrible has happened. Young Skywalker is in pain. Terrible pain',

    // type code here for "relation_many" field

    // type code here for "relation_one" field
  },

  {
    name: 'Archimedes',

    sector: "I'm washing my hands of it",

    description: 'That is why you fail.',

    // type code here for "relation_many" field

    // type code here for "relation_one" field
  },

  {
    name: 'Hans Selye',

    sector: 'Standby',

    description: 'Do. Or do not. There is no try.',

    // type code here for "relation_many" field

    // type code here for "relation_one" field
  },
];

const OrganizationsData = [
  {
    name: 'Charles Sherrington',
  },

  {
    name: 'Willard Libby',
  },

  {
    name: 'Claude Bernard',
  },

  {
    name: 'Alfred Kinsey',
  },
];

// Similar logic for "relation_many"

async function associateUserWithOrganization() {
  const relatedOrganization0 = await Organizations.findOne({
    offset: Math.floor(Math.random() * (await Organizations.count())),
  });
  const User0 = await Users.findOne({
    order: [['id', 'ASC']],
    offset: 0,
  });
  if (User0?.setOrganization) {
    await User0.setOrganization(relatedOrganization0);
  }

  const relatedOrganization1 = await Organizations.findOne({
    offset: Math.floor(Math.random() * (await Organizations.count())),
  });
  const User1 = await Users.findOne({
    order: [['id', 'ASC']],
    offset: 1,
  });
  if (User1?.setOrganization) {
    await User1.setOrganization(relatedOrganization1);
  }

  const relatedOrganization2 = await Organizations.findOne({
    offset: Math.floor(Math.random() * (await Organizations.count())),
  });
  const User2 = await Users.findOne({
    order: [['id', 'ASC']],
    offset: 2,
  });
  if (User2?.setOrganization) {
    await User2.setOrganization(relatedOrganization2);
  }

  const relatedOrganization3 = await Organizations.findOne({
    offset: Math.floor(Math.random() * (await Organizations.count())),
  });
  const User3 = await Users.findOne({
    order: [['id', 'ASC']],
    offset: 3,
  });
  if (User3?.setOrganization) {
    await User3.setOrganization(relatedOrganization3);
  }
}

async function associateInvestmentWithStartup() {
  const relatedStartup0 = await Startups.findOne({
    offset: Math.floor(Math.random() * (await Startups.count())),
  });
  const Investment0 = await Investments.findOne({
    order: [['id', 'ASC']],
    offset: 0,
  });
  if (Investment0?.setStartup) {
    await Investment0.setStartup(relatedStartup0);
  }

  const relatedStartup1 = await Startups.findOne({
    offset: Math.floor(Math.random() * (await Startups.count())),
  });
  const Investment1 = await Investments.findOne({
    order: [['id', 'ASC']],
    offset: 1,
  });
  if (Investment1?.setStartup) {
    await Investment1.setStartup(relatedStartup1);
  }

  const relatedStartup2 = await Startups.findOne({
    offset: Math.floor(Math.random() * (await Startups.count())),
  });
  const Investment2 = await Investments.findOne({
    order: [['id', 'ASC']],
    offset: 2,
  });
  if (Investment2?.setStartup) {
    await Investment2.setStartup(relatedStartup2);
  }

  const relatedStartup3 = await Startups.findOne({
    offset: Math.floor(Math.random() * (await Startups.count())),
  });
  const Investment3 = await Investments.findOne({
    order: [['id', 'ASC']],
    offset: 3,
  });
  if (Investment3?.setStartup) {
    await Investment3.setStartup(relatedStartup3);
  }
}

async function associateInvestmentWithUser() {
  const relatedUser0 = await Users.findOne({
    offset: Math.floor(Math.random() * (await Users.count())),
  });
  const Investment0 = await Investments.findOne({
    order: [['id', 'ASC']],
    offset: 0,
  });
  if (Investment0?.setUser) {
    await Investment0.setUser(relatedUser0);
  }

  const relatedUser1 = await Users.findOne({
    offset: Math.floor(Math.random() * (await Users.count())),
  });
  const Investment1 = await Investments.findOne({
    order: [['id', 'ASC']],
    offset: 1,
  });
  if (Investment1?.setUser) {
    await Investment1.setUser(relatedUser1);
  }

  const relatedUser2 = await Users.findOne({
    offset: Math.floor(Math.random() * (await Users.count())),
  });
  const Investment2 = await Investments.findOne({
    order: [['id', 'ASC']],
    offset: 2,
  });
  if (Investment2?.setUser) {
    await Investment2.setUser(relatedUser2);
  }

  const relatedUser3 = await Users.findOne({
    offset: Math.floor(Math.random() * (await Users.count())),
  });
  const Investment3 = await Investments.findOne({
    order: [['id', 'ASC']],
    offset: 3,
  });
  if (Investment3?.setUser) {
    await Investment3.setUser(relatedUser3);
  }
}

async function associateInvestmentWithOrganization() {
  const relatedOrganization0 = await Organizations.findOne({
    offset: Math.floor(Math.random() * (await Organizations.count())),
  });
  const Investment0 = await Investments.findOne({
    order: [['id', 'ASC']],
    offset: 0,
  });
  if (Investment0?.setOrganization) {
    await Investment0.setOrganization(relatedOrganization0);
  }

  const relatedOrganization1 = await Organizations.findOne({
    offset: Math.floor(Math.random() * (await Organizations.count())),
  });
  const Investment1 = await Investments.findOne({
    order: [['id', 'ASC']],
    offset: 1,
  });
  if (Investment1?.setOrganization) {
    await Investment1.setOrganization(relatedOrganization1);
  }

  const relatedOrganization2 = await Organizations.findOne({
    offset: Math.floor(Math.random() * (await Organizations.count())),
  });
  const Investment2 = await Investments.findOne({
    order: [['id', 'ASC']],
    offset: 2,
  });
  if (Investment2?.setOrganization) {
    await Investment2.setOrganization(relatedOrganization2);
  }

  const relatedOrganization3 = await Organizations.findOne({
    offset: Math.floor(Math.random() * (await Organizations.count())),
  });
  const Investment3 = await Investments.findOne({
    order: [['id', 'ASC']],
    offset: 3,
  });
  if (Investment3?.setOrganization) {
    await Investment3.setOrganization(relatedOrganization3);
  }
}

// Similar logic for "relation_many"

async function associateStartupWithOrganization() {
  const relatedOrganization0 = await Organizations.findOne({
    offset: Math.floor(Math.random() * (await Organizations.count())),
  });
  const Startup0 = await Startups.findOne({
    order: [['id', 'ASC']],
    offset: 0,
  });
  if (Startup0?.setOrganization) {
    await Startup0.setOrganization(relatedOrganization0);
  }

  const relatedOrganization1 = await Organizations.findOne({
    offset: Math.floor(Math.random() * (await Organizations.count())),
  });
  const Startup1 = await Startups.findOne({
    order: [['id', 'ASC']],
    offset: 1,
  });
  if (Startup1?.setOrganization) {
    await Startup1.setOrganization(relatedOrganization1);
  }

  const relatedOrganization2 = await Organizations.findOne({
    offset: Math.floor(Math.random() * (await Organizations.count())),
  });
  const Startup2 = await Startups.findOne({
    order: [['id', 'ASC']],
    offset: 2,
  });
  if (Startup2?.setOrganization) {
    await Startup2.setOrganization(relatedOrganization2);
  }

  const relatedOrganization3 = await Organizations.findOne({
    offset: Math.floor(Math.random() * (await Organizations.count())),
  });
  const Startup3 = await Startups.findOne({
    order: [['id', 'ASC']],
    offset: 3,
  });
  if (Startup3?.setOrganization) {
    await Startup3.setOrganization(relatedOrganization3);
  }
}

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await Investments.bulkCreate(InvestmentsData);

    await Startups.bulkCreate(StartupsData);

    await Organizations.bulkCreate(OrganizationsData);

    await Promise.all([
      // Similar logic for "relation_many"

      await associateUserWithOrganization(),

      await associateInvestmentWithStartup(),

      await associateInvestmentWithUser(),

      await associateInvestmentWithOrganization(),

      // Similar logic for "relation_many"

      await associateStartupWithOrganization(),
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('investments', null, {});

    await queryInterface.bulkDelete('startups', null, {});

    await queryInterface.bulkDelete('organizations', null, {});
  },
};
