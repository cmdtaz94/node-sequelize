module.exports = (Model, as, paramsKey = "id", modelKey = "id") => {
  return async (req, res, next) => {
    const paramsValue = req.params[paramsKey] ?? req[paramsKey];

    const model = await Model.findOne({
      where: { [modelKey]: paramsValue },
    });

    if (model) {
      req[as] = model;
      return next();
    }

    res.status(404).json({ errors: `Ressource Inconnue` });
  };
};
