const db = require('../models');
const FileDBApi = require('./file');
const crypto = require('crypto');
const Utils = require('../utils');

const Sequelize = db.Sequelize;
const Op = Sequelize.Op;

module.exports = class InvestmentsDBApi {
  static async create(data, options) {
    const currentUser = (options && options.currentUser) || { id: null };
    const transaction = (options && options.transaction) || undefined;

    const investments = await db.investments.create(
      {
        id: data.id || undefined,

        amount: data.amount || null,
        date: data.date || null,
        importHash: data.importHash || null,
        createdById: currentUser.id,
        updatedById: currentUser.id,
      },
      { transaction },
    );

    await investments.setStartup(data.startup || null, {
      transaction,
    });

    await investments.setInvestor(data.investor || null, {
      transaction,
    });

    await investments.setOrganization(currentUser.organization.id || null, {
      transaction,
    });

    return investments;
  }

  static async bulkImport(data, options) {
    const currentUser = (options && options.currentUser) || { id: null };
    const transaction = (options && options.transaction) || undefined;

    // Prepare data - wrapping individual data transformations in a map() method
    const investmentsData = data.map((item, index) => ({
      id: item.id || undefined,

      amount: item.amount || null,
      date: item.date || null,
      importHash: item.importHash || null,
      createdById: currentUser.id,
      updatedById: currentUser.id,
      createdAt: new Date(Date.now() + index * 1000),
    }));

    // Bulk create items
    const investments = await db.investments.bulkCreate(investmentsData, {
      transaction,
    });

    // For each item created, replace relation files

    return investments;
  }

  static async update(id, data, options) {
    const currentUser = (options && options.currentUser) || { id: null };
    const transaction = (options && options.transaction) || undefined;

    const investments = await db.investments.findByPk(id, {}, { transaction });

    await investments.update(
      {
        amount: data.amount || null,
        date: data.date || null,
        updatedById: currentUser.id,
      },
      { transaction },
    );

    await investments.setStartup(data.startup || null, {
      transaction,
    });

    await investments.setInvestor(data.investor || null, {
      transaction,
    });

    await investments.setOrganization(currentUser.organization.id || null, {
      transaction,
    });

    return investments;
  }

  static async remove(id, options) {
    const currentUser = (options && options.currentUser) || { id: null };
    const transaction = (options && options.transaction) || undefined;

    const investments = await db.investments.findByPk(id, options);

    await investments.update(
      {
        deletedBy: currentUser.id,
      },
      {
        transaction,
      },
    );

    await investments.destroy({
      transaction,
    });

    return investments;
  }

  static async findBy(where, options) {
    const transaction = (options && options.transaction) || undefined;

    const investments = await db.investments.findOne(
      { where },
      { transaction },
    );

    if (!investments) {
      return investments;
    }

    const output = investments.get({ plain: true });

    output.startup = await investments.getStartup({
      transaction,
    });

    output.investor = await investments.getInvestor({
      transaction,
    });

    output.organization = await investments.getOrganization({
      transaction,
    });

    return output;
  }

  static async findAll(filter, globalAccess, options) {
    var limit = filter.limit || 0;
    var offset = 0;
    const currentPage = +filter.page;

    offset = currentPage * limit;

    var orderBy = null;

    const transaction = (options && options.transaction) || undefined;
    let where = {};
    let include = [
      {
        model: db.startups,
        as: 'startup',
      },

      {
        model: db.users,
        as: 'investor',
      },

      {
        model: db.organizations,
        as: 'organization',
      },
    ];

    if (filter) {
      if (filter.id) {
        where = {
          ...where,
          ['id']: Utils.uuid(filter.id),
        };
      }

      if (filter.amountRange) {
        const [start, end] = filter.amountRange;

        if (start !== undefined && start !== null && start !== '') {
          where = {
            ...where,
            amount: {
              ...where.amount,
              [Op.gte]: start,
            },
          };
        }

        if (end !== undefined && end !== null && end !== '') {
          where = {
            ...where,
            amount: {
              ...where.amount,
              [Op.lte]: end,
            },
          };
        }
      }

      if (filter.dateRange) {
        const [start, end] = filter.dateRange;

        if (start !== undefined && start !== null && start !== '') {
          where = {
            ...where,
            date: {
              ...where.date,
              [Op.gte]: start,
            },
          };
        }

        if (end !== undefined && end !== null && end !== '') {
          where = {
            ...where,
            date: {
              ...where.date,
              [Op.lte]: end,
            },
          };
        }
      }

      if (
        filter.active === true ||
        filter.active === 'true' ||
        filter.active === false ||
        filter.active === 'false'
      ) {
        where = {
          ...where,
          active: filter.active === true || filter.active === 'true',
        };
      }

      if (filter.startup) {
        var listItems = filter.startup.split('|').map((item) => {
          return Utils.uuid(item);
        });

        where = {
          ...where,
          startupId: { [Op.or]: listItems },
        };
      }

      if (filter.investor) {
        var listItems = filter.investor.split('|').map((item) => {
          return Utils.uuid(item);
        });

        where = {
          ...where,
          investorId: { [Op.or]: listItems },
        };
      }

      if (filter.organization) {
        var listItems = filter.organization.split('|').map((item) => {
          return Utils.uuid(item);
        });

        where = {
          ...where,
          organizationId: { [Op.or]: listItems },
        };
      }

      if (filter.createdAtRange) {
        const [start, end] = filter.createdAtRange;

        if (start !== undefined && start !== null && start !== '') {
          where = {
            ...where,
            ['createdAt']: {
              ...where.createdAt,
              [Op.gte]: start,
            },
          };
        }

        if (end !== undefined && end !== null && end !== '') {
          where = {
            ...where,
            ['createdAt']: {
              ...where.createdAt,
              [Op.lte]: end,
            },
          };
        }
      }
    }

    let { rows, count } = options?.countOnly
      ? {
          rows: [],
          count: await db.investments.count({
            where: globalAccess ? {} : where,
            include,
            distinct: true,
            limit: limit ? Number(limit) : undefined,
            offset: offset ? Number(offset) : undefined,
            order:
              filter.field && filter.sort
                ? [[filter.field, filter.sort]]
                : [['createdAt', 'desc']],
            transaction,
          }),
        }
      : await db.investments.findAndCountAll({
          where: globalAccess ? {} : where,
          include,
          distinct: true,
          limit: limit ? Number(limit) : undefined,
          offset: offset ? Number(offset) : undefined,
          order:
            filter.field && filter.sort
              ? [[filter.field, filter.sort]]
              : [['createdAt', 'desc']],
          transaction,
        });

    //    rows = await this._fillWithRelationsAndFilesForRows(
    //      rows,
    //      options,
    //    );

    return { rows, count };
  }

  static async findAllAutocomplete(query, limit, globalAccess, organizationId) {
    let where = {};

    if (!globalAccess && organizationId) {
      where.organizationId = organizationId;
    }

    if (query) {
      where = {
        [Op.or]: [
          { ['id']: Utils.uuid(query) },
          Utils.ilike('investments', 'amount', query),
        ],
      };
    }

    const records = await db.investments.findAll({
      attributes: ['id', 'amount'],
      where,
      limit: limit ? Number(limit) : undefined,
      orderBy: [['amount', 'ASC']],
    });

    return records.map((record) => ({
      id: record.id,
      label: record.amount,
    }));
  }
};
