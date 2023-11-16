const products = {
  zl02_pro: {
    product: "zl02_pro",
    productNumber: "6765264630220609",
  },
  lenovok3: {
    product: "lenovok3",
    productNumber: "322451873835489",
  },
};

const urls = {
  zl02_pro: ["https://fb.me/255fhz14v", "https://fb.me/qwqwqw"],
  lenovok3: ["https://fb.me/3kaSU9EUG", "https://fb.me/300fhz14v", "https://fb.me/sdsdsd"],
};

const cities = [
  "La Paz",
  "El Alto",
  "Cochabamba",
  "Santa Cruz",
  "Oruro",
  "Potosi",
  "Sucre",
  "Tarija",
  "Provincia",
];

const cityList = (phone) =>
  createInteractiveMessage(
    phone,
    "list",
    "Ciudades",
    "Departamentos de Bolivia",
    cities.map((city, index) => ({
      id: (index + 1).toString().padStart(2, "0"),
      title: city,
    }))
  );

const createInteractiveMessage = (phone, type, button, title, rows) => ({
  messaging_product: "whatsapp",
  recipient_type: "individual",
  to: phone,
  type: "interactive",
  interactive: {
    type,
    body: { text: "*Selecciona la ciudad de donde escribes:*" },
    action: { button, sections: [{ title, rows }] },
  },
});

module.exports = {
  products,
  cities,
  cityList,
  urls
};
