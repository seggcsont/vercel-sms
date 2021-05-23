import { default as withCollection } from "../util/db";
import { parseAmount, parseDate, parsePlace } from "../util/parser";

module.exports = async (req, res) => {
  if (!req.body) {
    res.status(400).send(`Bad request: request body is empty!`);
  } else {
    console.log(`Request: ${req.body}`);

    const amount = parseAmount(req.body);
    const date = parseDate(req.body);
    const place = parsePlace(req.body);

    if (!amount)
      return res.status(400).send("Bad request: cannot parse amount");

    withCollection((collection) => {
      collection.findOne(
        { place: place },
        { projection: { _id: 0 } },
        (err, item) => {
          if (err) return res.status(500).json({ error: err });
          if (!item) {
            item = {
              place: place,
              aliases: [],
            };
          }
          item.amount = amount;
          item.date = date;
          console.log(item);

          return res.json(item);
        }
      );
    });
  }
};
