export const getPaginationParams = (req) => {
  const page = Math.max(1, parseInt(req.query.page) || 1);
  const limit = Math.min(100, Math.max(1, parseInt(req.query.limit) || 10));
  const skip = (page - 1) * limit;

  return { page, limit, skip };
};

export const createPaginationResponse = (data, total, page, limit) => {
  const totalPages = Math.ceil(total / limit);
  
  return {
    data,
    pagination: {
      page,
      limit,
      total,
      totalPages,
      hasNext: page < totalPages,
      hasPrev: page > 1
    }
  };
};

export const buildWhereClause = (searchFields, searchQuery) => {
  if (!searchQuery) return {};

  return {
    OR: searchFields.map(field => ({
      [field]: {
        contains: searchQuery,
        mode: 'insensitive'
      }
    }))
  };
};