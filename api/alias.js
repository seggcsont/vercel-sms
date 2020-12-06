const withCollection = require('../util/db');

module.exports = async (req, res) => {
  withCollection(collection => {
    collection.findOneAndUpdate({ place: req.body.place },
      { $addToSet: { aliases: req.body.alias } },
      { upsert: true },
      (err) => {
        if (err) return res.status(500).json({ error: err });
        return res.sendStatus(201);
      });
  });
}
