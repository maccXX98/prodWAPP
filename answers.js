const MESSAGING_PRODUCT = "whatsapp";
const RECIPIENT_TYPE = "individual";
const LANGUAGE_CODE = "es_AR";

const createMessage = (phone, templateName, imageId) => {
  const message = {
    messaging_product: MESSAGING_PRODUCT,
    recipient_type: RECIPIENT_TYPE,
    to: phone,
    type: "template",
    template: { name: templateName, language: { code: LANGUAGE_CODE } },
  };
  if (imageId)
    message.template.components = [
      {
        type: "header",
        parameters: [{ type: "image", image: { id: imageId } }],
      },
    ];
  return message;
};

const createTextMessage = (phone, body) => ({
  messaging_product: MESSAGING_PRODUCT,
  recipient_type: RECIPIENT_TYPE,
  to: phone,
  type: "text",
  text: { body },
});

const productMessage = (phone, product) =>
  product.productNumber || product.product
    ? createMessage(phone, product.product, product.productNumber)
    : createTextMessage(
        phone,
        `Este es nuestro producto: ${product.product.toUpperCase()}`
      );

const cityMessage = (phone, selectedCity) => {
  const cityTemplates = {
    "La Paz": "lapaz",
    "El Alto": "elalto",
    "Santa Cruz": ["santacruz", "988608488903056"],
    Cochabamba: ["cochabamba", "1299932704049169"],
    Oruro: ["oruro", "249366054810630"],
    Potosi: ["potosi", "673080724922255"],
    Sucre: ["sucre", "3370738149813591"],
    Tarija: ["tarija", "1291557428174863"],
    Provincia: "provincia",
  };

  const template = cityTemplates[selectedCity];
  return Array.isArray(template)
    ? createMessage(phone, ...template)
    : createMessage(phone, template);
};

const qrPaymentMessage = (phone) =>
  createMessage(phone, "pagoqr", "718877983033300");

const directPaymentMessage = (phone) => ({
  messaging_product: MESSAGING_PRODUCT,
  recipient_type: RECIPIENT_TYPE,
  to: phone,
  type: "interactive",
  interactive: {
    type: "flow",
    body: {
      text: "Cuerpo",
    },
    action: {
      name: "flow",
      parameters: {
        flow_message_version: "3",
        flow_token: "token",
        flow_id: "2000942496932704",
        flow_cta: "CTA",
        flow_action: "navigate",
        mode: "draft",
        flow_action_payload: {
          screen: "confirmData",
        },
      },
    },
  },
});

module.exports = {
  productMessage,
  cityMessage,
  directPaymentMessage,
  qrPaymentMessage,
};
