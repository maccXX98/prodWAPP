const express = require("express");
const { post } = require("axios");
const { products, urls, cities, cityList } = require("./options");
const {
  productMessage,
  cityMessage,
  directPaymentMessage,
  qrPaymentMessage,
} = require("./answers");

const app = express();
app.use(express.json());

app.get("/webhook", (req, res) => {
  req.query["hub.mode"] === "subscribe" &&
  req.query["hub.verify_token"] === process.env.Token
    ? res.status(200).send(req.query["hub.challenge"])
    : res.sendStatus(400);
});

app.post("/webhook", async (req, res) => {
  const value = req.body.entry?.[0]?.changes?.[0]?.value;
  if (!value) return res.sendStatus(500);

  const msgText = value.messages?.[0]?.text?.body.replace(/\s/g, "") || "";

  const clientPhone = value.contacts?.[0]?.wa_id || "";
  const productUrl = value.messages?.[0]?.referral?.source_url || "";
  const selectedCity =
    value.messages?.[0]?.interactive?.list_reply?.title || "";
  const jsonData = value.messages?.[0]?.interactive || "";
  const metod = value.messages?.[0]?.button?.text?.toLowerCase() || "";
  const METHOD_1 = "método 1";
  const METHOD_2 = "método 2";

  let product = false;
  let data;
  let productKey = Object.keys(products).find((key) => {
    let productName = products[key].product;

    let productUrlIncludes = urls[key].some((url) => {
      return productUrl.includes(url) || msgText.includes(url);
    });

    return productUrlIncludes || msgText.includes(productName);
  });

  if (productKey) {
    data = productMessage(clientPhone, products[productKey]);
    product = true;
  } else if (cities.includes(selectedCity)) {
    data = cityMessage(clientPhone, selectedCity);
  } else if (
    metod === METHOD_1 ||
    msgText === "1" ||
    metod === METHOD_2 ||
    msgText === "2"
  ) {
    data =
      metod === METHOD_1 || msgText === "1"
        ? directPaymentMessage(clientPhone)
        : qrPaymentMessage(clientPhone);
    if (metod === METHOD_2 || msgText === "2") {
      setTimeout(() => {
        postMessage(directPaymentMessage(clientPhone));
      }, 2000);
    }
  }

  try {
    await postMessage(data);
    if (product) {
      setTimeout(async () => {
        await postMessage(cityList(clientPhone));
      }, 2000);
    }
    res.sendStatus(200);
  } catch (error) {
    res.sendStatus(500);
  }
});

const postMessage = async (data) => {
  return await post(
    `https://graph.facebook.com/v18.0/${process.env.BotId}/messages`,
    data,
    {
      headers: {
        Authorization: `Bearer ${process.env.BearerToken}`,
        "Content-Type": "application/json",
      },
    }
  );
};

app.listen(process.env.PORT, () =>
  console.log(`Your app is listening on port ${process.env.PORT}`)
);
