const { Op } = require("sequelize");

module.exports = async (value, Model, key, idKey = null, id = null) => {
  const where = { [key]: value };

  if (idKey && id) {
    where[idKey] = { [Op.ne]: id };
  }

  const model = await Model.findOne({ where });

  if (model) {
    throw new Error(`${value} déjà utilisé`);
  }

  return true;
};
