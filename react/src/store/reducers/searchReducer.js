import * as actionTypes from "../actions/actionTypes";

const intitalState = {
    searchValue: "",
    token: "",
    customer_data: [],
    cartData: [],
    total: 0,
    customer: "",
    cash: 0,
    change: 0,
    menu: "",
    baseurl: "http://localhost:8765",
    userId: -1,
    offline: false,
};
const reducer = (state = intitalState, action) => {
    switch (action.type) {
        case actionTypes.SEARCH_FILTER:
            return {
                ...state,
                searchValue: action.payload,
            };
        case actionTypes.TOKEN_GENERATOR:
            return {
                ...state,
                token: action.payload,
            };
        case actionTypes.Fetch_Customer_Data:
            return {
                ...state,
                customer_data: action.payload,
            };
        case actionTypes.UPDATE_CART:
            return {
                ...state,
                cartData: action.payload,
                total: action.total,
            };
        case actionTypes.CUSTOMER_SET:
            return {
                ...state,
                customer: action.payload,
            };
        case actionTypes.ORDER_SUCCESS:
            return {
                ...state,
                cash: action.payload.cash,
                change: action.payload.change,
            };
        case actionTypes.MENU_UPDATE:
            return {
                ...state,
                menu: action.payload,
            };
        case actionTypes.USER_ID:
            return {
                ...state,
                userId: action.payload,
            };
        case actionTypes.INTERNET_STATUS:
            return {
                ...state,
                offline: action.payload,
            };
        default:
            return state;
    }
};
export default reducer;
