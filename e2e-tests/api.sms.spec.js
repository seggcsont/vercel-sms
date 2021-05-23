const sa = require("superagent");

describe("api/sms", () => {
  const apiUrl =
    process.env.ENVIRONMENT == "local"
      ? "http://localhost:3000/api/sms"
      : "http://vercel-sms.vercel.app/api/sms";
  const sendRequest = async (content) =>
    await sa.post(apiUrl).set("Content-type", "text/plain").send(content);

  console.log(`Testing on ${apiUrl}`);
  
  it("should return bad request if sms is not a valid format", async () => {
    try {
      await sendRequest("asdaf asdasd");
    } catch (err) {
      expect(err.response.status).toBe(400);
    }
  });

  it("should return amount and place for pos transaction visa", async () => {
    const response = await sendRequest(
     `Visa Prémium Kàrtya POS tranzakciò  17 916 Ft Idöpont: 2021.05.20 07:30:48 E: 4 706 146 Ft Hely: LIDL ARUHAZ 0177.SZ. BUDAPEST HU`
    );
    expect(response.body.place).toBe("Lidl Aruhaz 0177.sz. Budapest Hu");
    expect(response.body.amount).toBe(17916);
  });

  it("should return amount and place for pos transaction mastercard", async () => {
    const response = await sendRequest(
     `Mastercard Dombornyomott Kàrtya POS tranzakciò  2 118 Ft Idöpont: 2021.05.20 10:54:02 E: 4 697 603 Ft Hely: ROSSMANN 212. BUDAPEST HU`
    );
    expect(response.body.place).toBe("Rossmann 212. Budapest Hu");
    expect(response.body.amount).toBe(2118);
  });

  it("should return amount and place for transfer", async () => {
    const response = await sendRequest(
     `HUF fizetési szàmla (242476) utalàsi megbìzàs teljesült 5 000 Ft 2021.05.20 E: 4 689 015 Ft Kedv.: Sòlyom Vanda Közl: Tarcsànyi Làszlò Tibor`
    );
    expect(response.body.place).toBe("Sòlyom Vanda Közl: Tarcsànyi Làszlò Tibor");
    expect(response.body.amount).toBe(5000);
  });

  it("should return amount and place for transfer", async () => {
    const response = await sendRequest(
      "kozuzemi megbizasa teljesult: 11 123 Ft Kedv.: dummy isp 2021.12.23"
    );
    expect(response.body.place).toBe("dummy isp");
    expect(response.body.amount).toBe(11123);
  });

  it("should Capital case upper case places", async () => {
    const response = await sendRequest(
      "POS tranzakcio 12345Ft Idopont: 2021.11.11 11:11:11 Hely: DUMMY PLACE"
    );
    expect(response.body.place).toBe("Dummy Place");
  });

  it("should not touch if place not all uppercase", async () => {
    const response = await sendRequest(
      "POS tranzakcio 12345Ft Idopont: 2021.11.11 11:11:11 Hely: DUmmY PLACE"
    );
    expect(response.body.place).toBe("DUmmY PLACE");
  });

  it("should parse date if available in the input", async () => {
    const response = await sendRequest(
     `Mastercard Dombornyomott Kàrtya POS tranzakciò  2 118 Ft Idöpont: 2021.05.20 10:54:02 E: 4 697 603 Ft Hely: ROSSMANN 212. BUDAPEST HU`
    );
    expect(response.body.date).toBe("20");
  });
});
