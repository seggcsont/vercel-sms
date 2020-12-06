// Import Dependencies
const withCollection = require('../util/db');
const EXPENSE_PATTERNS = [
  /.*POS tranzakci. (?<amount>[\d ,]+).*Hely: (?<place>.+)/,
  /.*megb.z.s teljes.lt (?<amount>[\d ,]+) Ft .*Kedv.: (?<place>.+)/,
  /k.z.zemi megb.z.sa teljes.lt: .*? (?<amount>[\d ,]+) Ft Kedv.: (?<place>.+) 202.\.[01][0-9].*/,
  /(?<place>esed.kes (?:kamat|hitel.*)) t.rlesztve (?<amount>[\d ,]+) Ft/
];

module.exports = async (req, res) => {
  if (!req.body) {
    res.status(400).send("Empty request")
  } else {
    console.log(`Request: ${req.body}`)
    const match = EXPENSE_PATTERNS.map(p => req.body.match(p)).filter((match) => match).shift();

    if (match) {
      console.log(match);
      const amount = parseInt(match.groups.amount.trim().replace(/ /g, ""));
      const place = match.groups.place.trim();

      withCollection( collection => {
        collection.findOne({ place: place }, { projection: { _id: 0 } }, (err, item) => {
          if (err) return res.status(500).json({ error: err });
          if (!item) {
            item = {
              place: place,
              aliases: []
            };
          }
          item.amount = amount;
          console.log(item);

          return res.json(item);
        })
      });
    } else {
      res.status(400).send("Request does match to any pattern: \n"+ EXPENSE_PATTERNS.join('\n'));
    }
  }
}
