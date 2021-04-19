exports.advancedResults = (model, populate) => async (req, res, next) => {

    // Copy req.query
    const reqQuery = { ...req.query };

    // Fields to exclude
    const removedFields = ['select', 'sort', 'limit', 'page']; // Selectin bura olması talha aydemir tarafından reddedildi.

    // Loopover removedFields and delete them from query
    removedFields.forEach(param => delete reqQuery[param]);

    // Create query string
    let queryStr = JSON.stringify(reqQuery);

    // Create operators ($gt , $gte etc...)
    queryStr = queryStr.replace(/\b(gt|gte|lt|lte|in)\b/g, match => `$${match}`);

    // Finding resource
    let query = model.find(JSON.parse(queryStr));

    // Pagination fields
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 100;
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    const total = await model.countDocuments();
    query = query.skip(startIndex).limit(limit);

    // Pagination results
    const pagination = {};

    if (endIndex < total) {

        pagination.next = {
            page: page + 1,
            limit
        }
    }
    if (startIndex > 0) {

        pagination.prev = {
            page: page - 1,
            limit
        }
    }

    // Select fields

    if (req.query.select) {
        const selectFields = req.query.select.split(',').join(' ');
        query = query.select(selectFields);
    }

    // Sort fields

    if (req.query.sort) {
        const sortFields = req.query.sort.split(',').join(' ');
        query = query.sort(sortFields);
    } else {
        query = query.sort('createdAt');
    }

    if (populate) {

        query = query.populate(populate);
    }

    // Executing query
    const results = await query;

    res.advancedResults = {
        success: true,
        count: results.length,
        pagination,
        data: results,
    }

    next();
}