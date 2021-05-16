const sa = require("superagent");

describe("api/sms", () => {
  it("should return bad request if sms is not a valid format", async () => {
    try {
      await sa
        .post("http://localhost:3000/api/sms")
        .set("Content-type", "text/plain")
        .send("asdaf asdasd");
    } catch (err) {
      expect(err.response.status).toBe(400);
    }
  });

  it("should return amount and place for pos transaction", async () => {
    const response = await sa
      .post("http://localhost:3000/api/sms")
      .set("Content-type", "text/plain")
      .send("POS tranzakcio 12345Ft Hely: dummy place");
    expect(response.body.place).toBe("dummy place");
    expect(response.body.amount).toBe(12345);
  });

  it("should return amount and place for transfer", async () => {
    const response = await sa
      .post("http://localhost:3000/api/sms")
      .set("Content-type", "text/plain")
      .send("megbizas teljesult 112233 Ft Kedv.: dummy person");
    expect(response.body.place).toBe("dummy person");
    expect(response.body.amount).toBe(112233);
  });

  it("should return amount and place for transfer", async () => {
    const response = await sa
      .post("http://localhost:3000/api/sms")
      .set("Content-type", "text/plain")
      .send(
        "kozuzemi megbizasa teljesult:  11 123 Ft Kedv.: dummy isp 2021.12.23"
      );
    expect(response.body.place).toBe("dummy isp");
    expect(response.body.amount).toBe(11123);
  });

  it("should Capital case upper case places", async () => {
    const response = await sa
      .post("http://localhost:3000/api/sms")
      .set("Content-type", "text/plain")
      .send("POS tranzakcio 12345Ft Hely: DUMMY PLACE");
    expect(response.body.place).toBe("Dummy Place");
  });

  it("should not touch if place not all uppercase", async () => {
    const response = await sa
      .post("http://localhost:3000/api/sms")
      .set("Content-type", "text/plain")
      .send("POS tranzakcio 12345Ft Hely: DUmmY PLACE");
    expect(response.body.place).toBe("DUmmY PLACE");
  });
});
