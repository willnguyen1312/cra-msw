import React, { useState, useEffect, useReducer } from "react";
import { render } from "react-dom";
import axios from "axios";
import "./style.css";

type State =
  | { status: "empty" }
  | { status: "loading" }
  | { status: "error"; error: string }
  | { status: "success"; data: HNResponse };

type HNResponse = {
  hits: {
    title: string;
    objectID: string;
    url: string;
  }[];
};

type Action =
  | { type: "request" }
  | { type: "success"; results: HNResponse }
  | { type: "failure"; error: string };

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case "request":
      return { status: "loading" };
    case "success":
      return { status: "success", data: action.results };
    case "failure":
      return { status: "error", error: action.error };
  }
}

function App() {
  const [query, setQuery] = useState<string>();
  const [state, dispatch] = useReducer(reducer, { status: "empty" });

  useEffect(() => {
    let ignore = false;

    dispatch({ type: "request" });
    axios(`https://hn.algolia.com/api/v1/search?query=${query}`).then(
      (results) => {
        if (!ignore) dispatch({ type: "success", results: results.data });
      },
      (error) => dispatch({ type: "failure", error })
    );

    return () => {
      ignore = true;
    };
  }, [query]);

  return (
    <div>
      <input value={query} onChange={(e) => setQuery(e.target.value)} />
      {state.status === "loading" && <span>Loading...</span>}
      {state.status === "success" && (
        <ul>
          {state.data &&
            state.data.hits &&
            state.data.hits.map((item) => (
              <li key={item.objectID}>
                <a href={item.url}>{item.title}</a>
              </li>
            ))}
        </ul>
      )}
      {state.status === "error" && <span>Error: {state.error}</span>}
    </div>
  );
}

render(<App />, document.getElementById("root"));
