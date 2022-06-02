module.exports.successResponse = (data, res, status = 200) => {
  res.status(status).json(data);
};

module.exports.errorResponse = (error, res, status = 500) => {
  res.status(status).json({ error });
};
