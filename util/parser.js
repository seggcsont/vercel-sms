const AMOUNT_PATTERN =
  /.*(?:POS tranzakci.|megb.z.sa? teljes.lt:?| utal.s .rkezett) [^:]*?(?<amount>[\d ,]+) ?Ft.*/;
const DATE_PATTERN =
  /.* 202\d\.\d\d\.(?<date>\d+) (?:\d+:\d+:\d+ )?E:.*/;
const PLACE_PATTERN = /(?:Hely:|Kedv.:|K.ld.:|esed.kes) (?<place>[^:0-9]+)/;

const HUNGARIAN_CHAR_MAPPING = {
  "a'": "á",
  "A'": "Á",
  "e'": "é",
  "E'": "É",
  "i'": "í",
  "I'": "Í",
  "o'": "ó",
  "O'": "Ó",
  "o:": "ö",
  "O:": "Ö",
  "u'": "ú",
  "U'": "Ú",
  "u:": "ü",
  "U:": "Ü",
};

export function parseAmount(str) {
  const match = str.match(AMOUNT_PATTERN);
  return match
    ? parseInt(match.groups.amount.trim().replace(/[ ,]/g, ""))
    : undefined;
}

export function parseDate(str) {
  const match = str.match(DATE_PATTERN);
  return match ? parseInt(match.groups.date) : new Date().getDate();
}

export function parsePlace(str) {
  const match = str.match(PLACE_PATTERN);
  let rawPlace = match ? match.groups.place.trim() : "";
  rawPlace = resolveSpecialCharacters(rawPlace);
  rawPlace = removeDates(rawPlace);
  return isUppercase(rawPlace) ? upperToCapitalCase(rawPlace) : rawPlace;
}

function resolveSpecialCharacters(str) {
  let ret = str;
  for (let c in HUNGARIAN_CHAR_MAPPING) {
    ret = ret.replace(new RegExp(c, "g"), HUNGARIAN_CHAR_MAPPING[c]);
  }
  return ret;
}

function removeDates(str) {
  return str.replace(/202\d\.\d\d?\.\d\d?/, "");
}

function isUppercase(str) {
  return str && str === str.toUpperCase();
}

function upperToCapitalCase(str) {
  return str
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.toLowerCase().slice(1))
    .join(" ");
}
