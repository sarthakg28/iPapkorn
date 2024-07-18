import React, { useState } from "react";
import ReactDOM from "react-dom/client";
// import StarRating from "./components/StarRating";
import "./index.css";
import App from "./App";
// import reportWebVitals from './reportWebVitals';

/*function Test() {
  const [currentRating, setCurrentRating] = useState(0);
  return (
    <div>
      <StarRating
        maxRating={6}
        color="red"
        size={30}
        onSetCurrent={setCurrentRating}
      />
      <p>Your Current rating is {currentRating}. </p>
    </div>
  );
}*/

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <App />
    {/* <StarRating maxRating={6} />
    <StarRating maxRating={4} />
    <StarRating
      maxRating={4}
      color="green"
      size={24}
      messages={["bad", "good", "better", "best"]}
      defaultRating={3}
    />
    <Test /> */}
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
// reportWebVitals();
