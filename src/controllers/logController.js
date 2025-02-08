'use strict';

const searchService = require('../services/searchService');

exports.searchLogs = async (req, res, next) => {
    try {
        const page = +req.query.page || 1;
        const limit = +req.query.limit || 10;
        const offset = (page - 1) * limit;
        const logs = await searchService.searchLogs();
        const paginatedLogs = logs.slice(offset, offset + limit);
        res.status(200).send({ curretPage: page, totalPage: Math.ceil(logs.length / limit), totalLogs: logs.length, data: paginatedLogs });
    } catch (error) {
        next(error);
    }
};
