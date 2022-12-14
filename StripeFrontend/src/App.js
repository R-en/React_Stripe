import logo from "./logo.svg";
import "./App.css";
import StripeCheckout from "react-stripe-checkout";
import { useState } from "react";

function App() {
  const [product, setProduct] = useState({
    name: "React from FaceBook",
    price: 10,
    productBy: "FaceBook",
  });

  const makePayment = (token) => {
    const body = {
      token,
      product,
    };

    const headers = {
      "Content-type": "application/json",
    };

    return fetch(`http://localhost:8282/payment`, {
      method: "POST",
      headers,
      body: JSON.stringify(body),
    })
      .then((response) => {
        console.log("RESPONSE ", response);
        const { status } = response;
        console.log("STATUS ", status);
      })
      .catch((error) => console.log(error));
  };
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <a
          className="App-link"
          href="#"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn to pay with Stripe checkout
        </a>
        <StripeCheckout
          stripeKey={process.env.REACT_APP_KEY}
          token={makePayment}
          name="Buy React"
          price={product.price * 100}
        >
          <button className="btn btn-large blue">
            Buy React for just ${product.price}
          </button>
        </StripeCheckout>
      </header>
    </div>
  );
}

export default App;
