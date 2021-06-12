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

    it("should return amount for monthly debit 'kamat'", () => {
      const place = parseAmount(
        `HUF fizetési szàmla (242476) esedékes kamat törlesztve 6 616 Ft 2021.06.10 E: 921 345 Ft Közl: 01D62242476`
      );
      expect(place).toBe(6616);
    });

    it("should return amount for monthly debit 'hitel'", () => {
      const place = parseAmount(
        `HUF fizetési szàmla (242476) esedékes hitel/ tartozàs törlesztve 44 037 Ft 2021.06.10 E: 877 308 Ft Közl: 01D62242476`
      );
      expect(place).toBe(44037);
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
      expect(place).toBe("Lidl Aruhaz");
    });

    it("should resolve places with hungarian character", () => {
      const place = parsePlace(
        `Visa Prémium Kàrtya POS tranzakciò  17 916 Ft Idöpont: 2021.05.20 07:30:48 E: 4 706 146 Ft Hely: LIDL A'RUHA'Z 0177.SZ. BUDAPEST HU`
      );
      expect(place).toBe("Lidl Áruház");
    });

    it("should return place for POS transaction - Mastercard", () => {
      const place = parsePlace(
        `Mastercard Dombornyomott Kàrtya POS tranzakciò  2 118 Ft Idöpont: 2021.05.20 10:54:02 E: 4 697 603 Ft Hely: ROSSMANN 212. BUDAPEST HU`
      );
      expect(place).toBe("Rossmann");
    });

    it("should return place for transfer", () => {
      const place = parsePlace(
        `HUF fizetési szàmla (242476) utalàsi megbìzàs teljesült 5 000 Ft 2021.05.20 E: 4 689 015 Ft Kedv.: Sòlyom Vanda Közl: Tarcsànyi Làszlò Tibor`
      );
      expect(place).toBe("Sòlyom Vanda Közl");
    });

    it("should return place for utility bill", () => {
      const place = parsePlace(
        `HUF fizetési szàmla (242476) közüzemi megbìzàsa teljesült: Életbiztosìtàs 16 380 Ft Kedv.: AEGON MAGYARO. ÅLT. BIZT. ZRT. 2021.06.11 E: 812 960 Ft Közl: `
      );
      expect(place).toBe("Aegon Magyaro. Ålt. Bizt. Zrt.");
    });

    it("should Capital case all uppercase place", () => {
      const place = parsePlace(
        `Mastercard Dombornyomott Kàrtya POS tranzakciò  2 118 Ft Idöpont: 2021.05.20 10:54:02 E: 4 697 603 Ft Hely: ROSSMANN 212. BUDAPEST HU`
      );
      expect(place).toBe("Rossmann");
    });

    it("should leave case unchanged if not all uppercase place", () => {
      const place = parsePlace(
        `Mastercard Dombornyomott Kàrtya POS tranzakciò  2 118 Ft Idöpont: 2021.05.20 10:54:02 E: 4 697 603 Ft Hely: Rossmann 212. BUDAPEST HU`
      );
      expect(place).toBe("Rossmann");
    });

    it("should return place for monthly debit 'kamat'", () => {
      const place = parsePlace(
        `HUF fizetési szàmla (242476) esedékes kamat törlesztve 6 616 Ft 2021.06.10 E: 921 345 Ft Közl: 01D62242476`
      );
      expect(place).toBe("kamat törlesztve");
    });

    it("should return place for monthly debit 'hitel'", () => {
      const place = parsePlace(
        `HUF fizetési szàmla (242476) esedékes hitel/ tartozàs törlesztve 44 037 Ft 2021.06.10 E: 877 308 Ft Közl: 01D62242476`
      );
      expect(place).toBe("hitel/ tartozàs törlesztve");
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

    it("should return date for utility bill", () => {
      const date = parseDate(
        `HUF fizetési szàmla (242476) közüzemi megbìzàsa teljesült: Életbiztosìtàs 16 380 Ft Kedv.: AEGON MAGYARO. ÅLT. BIZT. ZRT. 2021.06.11 E: 812 960 Ft Közl: `
      );
      expect(date).toBe(11);
    });
  });
});
