import React, { useState, useReducer } from "react";
import axios from "axios";

interface State {
  error?: null | string;
  greeting?: null | string;
}

interface Action {
  type: "SUCCESS" | "ERROR";
  error?: null | string;
  greeting?: null | string;
}

function greetingReducer(state: State, action: Action) {
  switch (action.type) {
    case "SUCCESS": {
      return {
        error: null,
        greeting: action.greeting,
      };
    }
    case "ERROR": {
      return {
        error: action.error,
        greeting: null,
      };
    }
    default: {
      return state;
    }
  }
}

export default function Fetch({ url }: { url: string }) {
  const [{ error, greeting }, dispatch] = useReducer(greetingReducer, {});
  const [buttonClicked, setButtonClicked] = useState(false);

  const fetchGreeting = async () => {
    axios
      .get(url)
      .then((response) => {
        const { data } = response;
        const { greeting } = data;
        dispatch({ type: "SUCCESS", greeting });
        setButtonClicked(true);
      })
      .catch((error) => {
        dispatch({ type: "ERROR", error: "oh no" });
      });
  };

  const buttonText = buttonClicked ? "Ok" : "Load Greeting";

  return (
    <div>
      <button onClick={fetchGreeting} disabled={buttonClicked}>
        {buttonText}
      </button>
      {greeting && <h1>{greeting}</h1>}
      {error && <p role="alert">Oops, failed to fetch!</p>}
    </div>
  );
}
