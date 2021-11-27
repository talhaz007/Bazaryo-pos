import React from "react";
import ReactDOM from "react-dom";
import { CookiesProvider } from "react-cookie";
import { Provider } from "react-redux";
import { createStore, combineReducers, applyMiddleware, compose } from "redux";
import thunk from "redux-thunk";
import "../src/Assets/style/style.scss";
import searchReducer from "./store/reducers/searchReducer";
import { BrowserRouter as Router } from "react-router-dom";
import Navigation from "./Navigation/Navigation";

const rootReducer = combineReducers({
    srch: searchReducer,
});

const logger = (store) => {
    return (next) => {
        return (action) => {
            console.log("[Middleware] Dispatching", action);
            const result = next(action);
            console.log("[Middleware] next state", store.getState());
            return result;
        };
    };
};

const composeEnhancer = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
const store = createStore(
    rootReducer,
    composeEnhancer(applyMiddleware(logger, thunk))
);

ReactDOM.render(
    <CookiesProvider>
        <Provider store={store}>
            <Router>
                <React.StrictMode>
                    <Navigation />
                </React.StrictMode>
            </Router>
        </Provider>
    </CookiesProvider>,
    document.getElementById("root")
);
