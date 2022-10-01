const cors = require("cors");
const express = require("express");
//TODO:Add a stripe key
const stripe = require("stripe")(
  "sk_test_51LkER3AkoGUq9Iz6TdWpK9cPV3bA9UaG8afgIIIKLCJuBuYugU7Ez6MtpZaJ9tooo45NxJjbK4JxvG3ShqCjWx4s00uBp8Lmd5"
);
//const uuid = require("uuid/v4");
//import { uuid as uuidv4 } from "uuid";
const { v4: uuid } = require("uuid");

const app = express();

//middleware
app.use(express.json());
app.use(cors());

//routes
app.get("/", (req, res) => {
  res.send("IT WORKS AT LEARNCODEONLINE");
});

app.post("./payment", (req, res) => {
  const { product, token } = req.body;
  console.log("Product ", product);
  console.log("Product price ", product.price);
  const idempotencyKey = uuid();

  return stripe.customers
    .create({
      email: token.email,
      source: token.id,
    })
    .then((customer) => {
      stripe.charges.create(
        {
          amount: product.price * 100,
          currency: "usd",
          customer: customer.id,
          receipt_email: token.email,
          description: `Purchase of ${product.name}`,
          shipping: {
            name: token.card.name,
            address: {
              country: token.card.address_country,
            },
          },
        },
        { idempotencyKey }
      );
    })
    .then((result) => res.status(200).json(result))
    .catch((error) => console.log(error));
});

//listen
app.listen(8282, () => console.log("LISTENING TO PORT 8282"));
