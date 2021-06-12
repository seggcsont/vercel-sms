import { parseAmount, parsePlace, parseDate } from "./parser";

describe("util/parser.js", () => {
  describe("parseAmount", () => {
    it("should return undefined if not matched", () => {
      const amount = parseAmount("not matching string");
      expect(amount).toBe(undefined);
    });

    it("should return amount for POS transaction - VISA", () => {
      const amount = parseAmount(
        `Visa Prémium Kàrtya POS tranzakciò  17 916 Ft Idöpont: 2021.05.20 07:30:48 E: 4 706 146 Ft Hely: LIDL ARUHAZ 0177.SZ. BUDAPEST HU`
      );
      expect(amount).toBe(17916);
    });

    it("should return amount for POS transaction - Mastercard", () => {
      const amount = parseAmount(
        `Mastercard Dombornyomott Kàrtya POS tranzakciò  2 118 Ft Idöpont: 2021.05.20 10:54:02 E: 4 697 603 Ft Hely: ROSSMANN 212. BUDAPEST HU`
      );
      expect(amount).toBe(2118);
    });

    it("should return amount for transfer", () => {
      const amount = parseAmount(
        `HUF fizetési szàmla (242476) utalàsi megbìzàs teljesült 5 000 Ft 2021.05.20 E: 4 689 015 Ft Kedv.: Sòlyom Vanda Közl: Tarcsànyi Làszlò Tibor`
      );
      expect(amount).toBe(5000);
    });

    it("should return amount for utility bill", () => {
      const amount = parseAmount(
        `HUF fizetési szàmla (242476) közüzemi megbìzàsa teljesült: Életbiztosìtàs 16 380 Ft Kedv.: AEGON MAGYARO. ÅLT. BIZT. ZRT. 2021.06.11 E: 812 960 Ft Közl: `
      );
      expect(amount).toBe(16380);
    });
  });

  describe("parsePlace", () => {
    it("should return undefined if not matched", () => {
      const place = parsePlace("not matching string");
      expect(place).toBe("");
    });

    it("should return place for POS transaction - VISA", () => {
      const place = parsePlace(
        `Visa Prémium Kàrtya POS tranzakciò  17 916 Ft Idöpont: 2021.05.20 07:30:48 E: 4 706 146 Ft Hely: LIDL ARUHAZ 0177.SZ. BUDAPEST HU`
      );
      expect(place).toBe("Lidl Aruhaz 0177.sz. Budapest Hu");
    });

    it("should resolve places with hungarian character", () => {
      const place = parsePlace(
        `Visa Prémium Kàrtya POS tranzakciò  17 916 Ft Idöpont: 2021.05.20 07:30:48 E: 4 706 146 Ft Hely: LIDL A'RUHA'Z 0177.SZ. BUDAPEST HU`
      );
      expect(place).toBe("Lidl Áruház 0177.sz. Budapest Hu");
    });

    it("should return place for POS transaction - Mastercard", () => {
      const place = parsePlace(
        `Mastercard Dombornyomott Kàrtya POS tranzakciò  2 118 Ft Idöpont: 2021.05.20 10:54:02 E: 4 697 603 Ft Hely: ROSSMANN 212. BUDAPEST HU`
      );
      expect(place).toBe("Rossmann 212. Budapest Hu");
    });

    it("should return place for transfer", () => {
      const place = parsePlace(
        `HUF fizetési szàmla (242476) utalàsi megbìzàs teljesült 5 000 Ft 2021.05.20 E: 4 689 015 Ft Kedv.: Sòlyom Vanda Közl: Tarcsànyi Làszlò Tibor`
      );
      expect(place).toBe("Sòlyom Vanda Közl: Tarcsànyi Làszlò Tibor");
    });

    it("should return place for monthly bill", () => {
      const place = parsePlace(
        `HUF fizetési szàmla (242476) utalàsi megbìzàs teljesült 5 000 Ft 2021.05.20 E: 4 689 015 Ft Kedv.: Sòlyom Vanda Közl: Tarcsànyi Làszlò Tibor`
      );
      expect(place).toBe("Sòlyom Vanda Közl: Tarcsànyi Làszlò Tibor");
    });

    /*it("should return place for utility bill", () => {
      const place = parsePlace(
        `HUF fizetési szàmla (242476) közüzemi megbìzàsa teljesült: Életbiztosìtàs 16 380 Ft Kedv.: AEGON MAGYARO. ÅLT. BIZT. ZRT. 2021.06.11 E: 812 960 Ft Közl: `
      );
      expect(place).toBe("dummy isp 2021.12.23");
    });*/

    it("should Capital case all uppercase place", () => {
      const place = parsePlace(
        `Mastercard Dombornyomott Kàrtya POS tranzakciò  2 118 Ft Idöpont: 2021.05.20 10:54:02 E: 4 697 603 Ft Hely: ROSSMANN 212. BUDAPEST HU`
      );
      expect(place).toBe("Rossmann 212. Budapest Hu");
    });

    it("should leave case unchanged if not all uppercase place", () => {
      const place = parsePlace(
        `Mastercard Dombornyomott Kàrtya POS tranzakciò  2 118 Ft Idöpont: 2021.05.20 10:54:02 E: 4 697 603 Ft Hely: Rossmann 212. BUDAPEST HU`
      );
      expect(place).toBe("Rossmann 212. BUDAPEST HU");
    });
  });

  describe("parseDate", () => {
    it("should return today if not matched", () => {
      const date = parseDate("not matching string");
      expect(date).toBe(new Date().getDate());
    });

    it("should return date for POS transaction - VISA", () => {
      const date = parseDate(
        `Visa Prémium Kàrtya POS tranzakciò  17 916 Ft Idöpont: 2021.05.20 07:30:48 E: 4 706 146 Ft Hely: LIDL ARUHAZ 0177.SZ. BUDAPEST HU`
      );
      expect(date).toBe(20);
    });

    it("should return date for POS transaction - Mastercard", () => {
      const date = parseDate(
        `Mastercard Dombornyomott Kàrtya POS tranzakciò  2 118 Ft Idöpont: 2021.05.20 10:54:02 E: 4 697 603 Ft Hely: ROSSMANN 212. BUDAPEST HU`
      );
      expect(date).toBe(20);
    });

    it("should return date for transfer", () => {
      const date = parseDate(
        `HUF fizetési szàmla (242476) utalàsi megbìzàs teljesült 5 000 Ft 2021.05.20 E: 4 689 015 Ft Kedv.: Sòlyom Vanda Közl: Tarcsànyi Làszlò Tibor`
      );
      expect(date).toBe(20);
    });

    it("should return date for monthly bill", () => {
      const date = parseDate(
        `HUF fizetési szàmla (242476) közüzemi megbìzàsa teljesült: Életbiztosìtàs 16 380 Ft Kedv.: AEGON MAGYARO. ÅLT. BIZT. ZRT. 2021.06.11 E: 812 960 Ft Közl: `
      );
      expect(date).toBe(11);
    });
  });
});
