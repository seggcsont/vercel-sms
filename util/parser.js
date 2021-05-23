const AMOUNT_PATTERN =
  /.*(?:POS tranzakci.|megb.z.sa? teljes.lt:?| utal.s .rkezett) (?<amount>[\d ,]+) ?Ft.*/;
const DATE_PATTERN =
  /.*(?:Id.pont:|Ft) 202\d\.\d\d\.(?<date>\d+) (?:\d+:\d+:\d+ )?E:.*/;
const PLACE_PATTERN = /(?:Hely:|Kedv.:|K.ld.:) (?<place>.+)/;

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
  const rawPlace = match ? match.groups.place.trim() : "";
  return isUppercase(rawPlace) ? upperToCapitalCase(rawPlace) : rawPlace;
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
