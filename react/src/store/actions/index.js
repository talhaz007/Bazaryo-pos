import * as actionTypes from "./actionTypes";

export const searchFilter = (value) => {
    return {
        type: actionTypes.SEARCH_FILTER,
        payload: value,
    };
};

export const tokenGenerator = (value) => {
    return {
        type: actionTypes.TOKEN_GENERATOR,
        payload: value,
    };
};
export const cartUpdate = (data, total) => {
    return {
        type: actionTypes.UPDATE_CART,
        payload: data,
        total: total
    };
};
export const setCustomer = (value) => {
    return {
        type: actionTypes.CUSTOMER_SET,
        payload: value
    };
};
const fetchCustomerData = (data) => {
    return {
        type: actionTypes.Fetch_Customer_Data,
        payload: data,
    };
};
export const editCustomer = (value, token, push) => {
    return (dispatch) => {
        const requestOptions = {
            headers: {
                "Access-Control-Allow-Headers": "*",
                "API-AUTH-TOKEN": token,
                "API-RESPONSE-FORMAT": "application/json",
                "Content-Type": "application/json",
            },
        };
        fetch(
            `http://localhost:8765/apis/customers?id=${value}`,
            requestOptions
        )
            .then((res) => {
                return res.json();
            })
            .then((data) => {
                console.log(data, "heloooo");
                dispatch(fetchCustomerData(data));
            }).then(()=>push);
    };
};

export const orderSuccess = (cash, change) => {
    return {
        type: actionTypes.ORDER_SUCCESS,
        payload: {cash, change}
    };
};
export const menuUpdate = (value) => {
    return {
        type: actionTypes.MENU_UPDATE,
        payload: value
    };
};

export const userId = (value) => {
    return {
        type: actionTypes.USER_ID,
        payload: value
    };
};

export const internetStatus = (value) => {
    return {
        type: actionTypes.INTERNET_STATUS,
        payload: value
    };
};