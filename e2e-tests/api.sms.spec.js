const sa = require("superagent");

describe("api/sms", () => {
  const apiUrl =
    process.env.ENVIRONMENT == "local"
      ? "http://localhost:3000/api/sms"
      : "http://vercel-sms.vercel.app/api/sms";
  const sendRequest = async (content) =>
    await sa.post(apiUrl).set("Content-type", "text/plain").send(content);

  console.log(`Testing on ${apiUrl}`);
  
  it("should return bad request if sms is empty", async () => {
    try {
      await sendRequest(undefined);
    } catch (err) {
      expect(err.response.status).toBe(400);
    }
  });
  
  it("should return bad request if sms is not a valid format", async () => {
    try {
      await sendRequest("asdaf asdasd");
    } catch (err) {
      expect(err.response.status).toBe(400);
    }
  });

  it("should parse valid request", async () => {
    const response = await sendRequest(
     `Mastercard Dombornyomott Kàrtya POS tranzakciò  2 118 Ft Idöpont: 2021.05.20 10:54:02 E: 4 697 603 Ft Hely: ROSSMANN 212. BUDAPEST HU`
    );
    expect(response.body.amount).toBe(2118);
    expect(response.body.place).toBe("Rossmann 212. Budapest Hu");
    expect(response.body.date).toBe(20);
  });

});
