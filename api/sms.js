// Import Dependencies
const withCollection = require("../util/db");
const AMOUNT_PATTERN = /(?:POS tranzakci.|megb.z.s teljes.lt| utal.s .rkezett) ([\d ,]+) Ft/
const EXPENSE_PATTERNS = [
  /.*POS tranzakci. (?<amount>[\d ,]+).*Id.pont: 202\d\.\d\d.(?<date>\d?\d).*Hely: (?<place>.+)/,
  /.*megb.z.s teljes.lt (?<amount>[\d ,]+) Ft .*Kedv.: (?<place>.+)/,
  /k.z.zemi megb.z.sa teljes.lt: .*? (?<amount>[\d ,]+) Ft Kedv.: (?<place>.+) 202.\.[01][0-9].*/,
  /(?<place>esed.kes (?:kamat|hitel.*)) t.rlesztve (?<amount>[\d ,]+) Ft/,
];

const isUppercase = (str) => str === str.toUpperCase();
const upperToCapitalCase = (str) =>
  str
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.toLowerCase().slice(1))
    .join(" ");

module.exports = async (req, res) => {
  if (!req.body) {
    res.status(400).send("Empty request");
  } else {
    console.log(`Request: ${req.body}`);
    const match = EXPENSE_PATTERNS.map((p) => req.body.match(p))
      .filter((match) => match)
      .shift();

    if (match) {
      console.log(match);
      const amount = req.body.match(AMOUNT_PATTERN).group(1).trim().replace(/[ ,]/g, "");
      const date = match.groups.date || new Date().getDate();
      const rawPlace = match.groups.place.trim();
      const place = isUppercase(rawPlace)
        ? upperToCapitalCase(rawPlace)
        : rawPlace;
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
    } else {
      res
        .status(400)
        .send(
          "Request does match to any pattern: \n" + EXPENSE_PATTERNS.join("\n")
        );
    }
  }
};
