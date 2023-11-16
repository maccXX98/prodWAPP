const express = require("express");
const fetch = require("node-fetch");
const options = require("./options");
const {
  productMessage,
  cityMessage,
  generalMessage,
  directPaymentMessage,
  QrPaymentMessage,
} = require("./answers");

const app = express();
app.use(express.json());

app.get("/webhook", (req, res) => {
  if (
    req.query["hub.mode"] === "subscribe" &&
    req.query["hub.verify_token"] === process.env.SECRET
  ) {
    res.send(req.query["hub.challenge"]);
  } else {
    res.sendStatus(400);
  }
});

app.post("/webhook", (req, res) => {
  try {
    const value = req.body.entry?.[0]?.changes?.[0]?.value;
    if (!value) throw new Error("Invalid request body");

    const title =
      value.messages?.[0]?.interactive?.button_reply?.title
        ?.toLowerCase()
        .trim() || "";
    const msgText =
      value.messages?.[0]?.text?.body
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/\.$/, "")
        .toLowerCase()
        .trim() || "";
    const phone = value.contacts?.[0]?.wa_id || "";

    let data;
    if (options.productos.includes(msgText)) {
      data = productMessage(phone, msgText);
    } else if (options.ciudades.includes(msgText)) {
      data = cityMessage(phone, msgText);
    } else if (title === "pago directo") {
      data = directPaymentMessage(phone);
    } else if (title === "pago qr") {
      data = QrPaymentMessage(phone);
    } else {
      data = generalMessage(phone, "error");
    }

    const url = `https://graph.facebook.com/v18.0/${process.env.botId}/messages`;

    fetch(url, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.bearerToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })
      .then(() => {
        res.sendStatus(200);
      })
      .catch((error) => {
        console.error(error);
        res.sendStatus(500);
      });
  } catch (error) {
    console.error(error);
    res.sendStatus(500);
  }
});

app.listen(process.env.PORT, () =>
  console.log(`Your app is listening on port ${process.env.PORT}`)
);