import React, { useState, useEffect } from "react";
import { useCookies } from "react-cookie";
import { connect } from "react-redux";
import { searchFilter, setCustomer } from "../../store/actions";
import Localbase from "localbase";
import "./Header.scss";
import { FaTicketAlt, FaSearch, FaWifi, FaSyncAlt } from "react-icons/fa";
import History from "../../Navigation/History";

const Header = (props) => {
    let db = new Localbase("db");
    const { value, onSearchFilter } = props;
    const [cookies, setCookie, removeCookie] = useCookies(["user"]);
    const [mounted, setMounted] = useState(false);
    const [addCustomers, setAddCustomers] = useState([]);
    const [editCustomer, setEditCustomer] = useState([]);
    const [delCustomers, setDelCustomers] = useState([]);
    const [addProducts, setAddProducts] = useState([]);
    const [editProduct, setEditProduct] = useState([]);
    const [delProduct, setDelProduct] = useState([]);
    const [addOrder, setAddOrder] = useState([]);
    const [delOrder, setDelOrder] = useState([]);
    const [cookies1, setCookie1, removeCookie1] = useCookies(["userToken"]);

    console.log(props.token, "tokennnnnnn");

    // if (!mounted) {
    //     let addC = [];
    //     let editC = [];
    //     let deleteC = [];
    //     let addP = [];
    //     let editP = [];
    //     let delP = [];
    //     let addO = [];
    //     let delO = [];

    //     db.collection("customers")
    //         .get()
    //         .then((addingcustomers) => {
    //             console.log(addingcustomers, "customerssssss");
    //             addingcustomers.map((d) => {
    //                 if (d.sync_type === 1) {
    //                     addC.push(d);
    //                     console.log(addC, "add customersss");
    //                     setAddCustomers(addC);
    //                 } else if (d.sync_type == 2) {
    //                     editC.push(d);
    //                     console.log(editC, "edit dataaaa");
    //                     setEditCustomer(editC);
    //                 } else if (d.sync_type === 3) {
    //                     deleteC.push(d);
    //                     console.log(deleteC, "deleteCustomers");
    //                     setDelCustomers(deleteC);
    //                 }
    //             });
    //         });

    //     db.collection("products")
    //         .get()
    //         .then((addproducts) => {
    //             console.log(addproducts, "addiingppp");
    //             addproducts.map((d) => {
    //                 if (d.sync_type === 1) {
    //                     addP.push(d);
    //                     console.log(addP, "add productss");
    //                     setAddProducts(addP);
    //                 } else if (d.sync_type === 2) {
    //                     editP.push(d);
    //                     console.log(editP, "edit Product");
    //                     setEditProduct(editP);
    //                 } else if (d.sync_type === 3) {
    //                     delP.push(d);
    //                     console.log(delP, "DeleteProduct");
    //                     setDelProduct(delP);
    //                 }
    //             });
    //         });

    //     db.collection("orders")
    //         .get()
    //         .then((addorderss) => {
    //             console.log(addorderss, "Orderss");
    //             addorderss.map((d) => {
    //                 if (d.sync_type === 1) {
    //                     addO.push(d);
    //                     console.log(addO, "adding orderss");
    //                     setAddOrder(addO);
    //                 } else if (d.sync_type === 3) {
    //                     delO.push(d);
    //                     console.log(delO, "deletingg orderss");
    //                     setDelOrder(delO);
    //                 }
    //             });
    //         });
    // }

    // useEffect(() => {
    //     setMounted(true);
    // }, []);

    const onSync = async () => {
        // Customer Setting
        let addC = [];
        let editC = [];
        let deleteC = [];

        // Customer Setup
        let responeCustomer = await db
            .collection("customers")
            .get()
            .then((addingcustomers) => {
                console.log(addingcustomers, "customerssssss");
                addingcustomers.map((d) => {
                    if (d.sync_type === 1) {
                        addC.push(d);
                        console.log(addC, "adddddddddddd customersss");
                        // setAddCustomers(addC);
                    } else if (d.sync_type == 2) {
                        editC.push(d);
                        console.log(editC, "ediiiiit dataaaa");
                        // setEditCustomer(editC);
                    } else if (d.sync_type === 3) {
                        deleteC.push(d);
                        console.log(deleteC, "deleteCustomers");
                        // setDelCustomers(deleteC);
                    }
                });
            });
            setAddCustomers(addC);
            setEditCustomer(editC);
            setDelCustomers(deleteC);
        console.log(responeCustomer, "responseCustomerrrrrrrrrr");

        //setting products
        let addP = [];
        let editP = [];
        let delP = [];

        //product setup
        let responseProducts = await db
            .collection("products")
            .get()
            .then((addproducts) => {
                console.log(addproducts, "addiingppp");
                addproducts.map((d) => {
                    if (d.sync_type === 1) {
                        addP.push(d);
                        console.log(addP, "add productss");
                        // setAddProducts(addP);
                    } else if (d.sync_type === 2) {
                        editP.push(d);
                        console.log(editP, "edit Product");
                       // setEditProduct(editP);
                    } else if (d.sync_type === 3) {
                        delP.push(d);
                        console.log(delP, "DeleteProduct");
                        // setDelProduct(delP);
                    }
                });
            });
            setAddProducts(addP);
            setEditProduct(editP);
            setDelProduct(delP);
        console.log(responseProducts, "responseProducts");

        //setting orders
        let addO = [];
        let delO = [];

        //orders Setup
        let ordersResponse = await db
            .collection("orders")
            .get()
            .then((addorderss) => {
                console.log(addorderss, "Orderss");
                addorderss.map((d) => {
                    if (d.sync_type === 1) {
                        addO.push(d);
                        console.log(addO, "adding orderss");
                        //setAddOrder(addO);
                    } else if (d.sync_type === 3) {
                        delO.push(d);
                        console.log(delO, "deletingg orderss");
                        setDelOrder(delO);
                    }
                });
            });
            setAddOrder(addO);
        console.log(ordersResponse, "orderss responss");

        // const addCustomerss = {
        //     method: "POST",
        //     headers: {
        //         "Access-Control-Allow-Headers": "*",
        //         "API-AUTH-TOKEN": props.token,
        //         "API-RESPONSE-FORMAT": "application/json",
        //         "Content-Type": "application/json",
        //     },
        //     body: JSON.stringify(addCustomers),
        // };
        // fetch("http://localhost:8765/apis/customers/add", addCustomerss).then(
        //     (res) => {
        //         res.json();
        //     }
        // );
        console.log("syningggg");

        // const editCustomerss = {
        //     method: "POST",
        //     headers: {
        //         "Access-Control-Allow-Headers": "*",
        //         "API-AUTH-TOKEN": props.token,
        //         "API-RESPONSE-FORMAT": "application/json",
        //         "Content-Type": "application/json",
        //     },
        //     body: JSON.stringify(editCustomer),
        // };
        // fetch("http://localhost:8765/apis/customers/edit", editCustomerss).then(
        //     (res) => {
        //         res.json();
        //     }
        // );

        // const deleteCustomerss = {
        //     method: "POST",
        //     headers: {
        //         "Access-Control-Allow-Headers": "*",
        //         "API-AUTH-TOKEN": props.token,
        //         "API-RESPONSE-FORMAT": "application/json",
        //         "Content-Type": "application/json",
        //     },
        //     body: JSON.stringify(delCustomers),
        // };
        // fetch(
        //     "http://localhost:8765/apis/customers/delete",
        //     deleteCustomerss
        // ).then((res) => res.json());

        // const addProductss = {
        //     method: "POST",
        //     headers: {
        //         "Access-Control-Allow-Headers": "*",
        //         "API-AUTH-TOKEN": props.token,
        //         "API-RESPONSE-FORMAT": "application/json",
        //         "Content-Type": "application/json",
        //     },
        //     body: JSON.stringify(addProducts),
        // };
        // fetch("http://localhost:8765/apis/products/add", addProductss).then(
        //     (res) => {
        //         res.json();
        //     }
        // );

        // const editProductss = {
        //     method: "POST",
        //     headers: {
        //         "Access-Control-Allow-Headers": "*",
        //         "API-AUTH-TOKEN": props.token,
        //         "API-RESPONSE-FORMAT": "application/json",
        //         "Content-Type": "application/json",
        //     },
        //     body: JSON.stringify(editProduct),
        // };
        // fetch("http://localhost:8765/apis/products/edit", editProductss).then((res) => res.json());

        // const deleteProductss = {
        //     method: "POST",
        //     headers: {
        //         "Access-Control-Allow-Headers": "*",
        //         "API-AUTH-TOKEN": props.token,
        //         "API-RESPONSE-FORMAT": "application/json",
        //         "Content-Type": "application/json",
        //     },
        //     body: JSON.stringify(delProduct),
        // };
        // fetch(
        //     "http://localhost:8765/apis/products/delete",
        //     deleteProductss
        // ).then((res) => {
        //     res.json();
        // });

        // const addOrderss = {
        //     method: "POST",
        //     headers: {
        //         "Access-Control-Allow-Headers": "*",
        //         "API-AUTH-TOKEN": props.token,
        //         "API-RESPONSE-FORMAT": "application/json",
        //         "Content-Type": "application/json",
        //     },
        //     body: JSON.stringify(addOrder),
        // };
        // fetch("http://localhost:8765/apis/orders/add", addOrderss).then(
        //     (res) => {
        //         res.json();
        //     }
        // );

        // const deleteOrderss = {
        //     method: "POST",
        //     headers: {
        //         "Access-Control-Allow-Headers": "*",
        //         "API-AUTH-TOKEN": props.token,
        //         "API-RESPONSE-FORMAT": "application/json",
        //         "Content-Type": "application/json",
        //     },
        //     body: JSON.stringify(delOrder),
        // };
        // fetch("http://localhost:8765/apis/orders/delete", deleteOrderss).then(
        //     (res) => {
        //         res.json();
        //     }
        // );
    };

    useEffect(() => {
        if(addOrder.length>0){
        const addOrderss = {
            method: "POST",
            headers: {
                "Access-Control-Allow-Headers": "*",
                "API-AUTH-TOKEN": props.token,
                "API-RESPONSE-FORMAT": "application/json",
                "Content-Type": "application/json",
            },
            body: JSON.stringify(addOrder),
        };
        fetch("http://localhost:8765/apis/orders/add", addOrderss).then(
            (res) => {
               return res.json();
            }
        ).then(()=> {
            addOrder.map(d=>{
            db.collection("orders")
            .doc({ id: parseInt(d.id) })
            .update({
                sync_type: 0,
            })
        })
        });
    }
    }, [addOrder])

    useEffect(() => {
        if(addProducts.length>0){
        const addProductss = {
            method: "POST",
            headers: {
                "Access-Control-Allow-Headers": "*",
                "API-AUTH-TOKEN": props.token,
                "API-RESPONSE-FORMAT": "application/json",
                "Content-Type": "application/json",
            },
            body: JSON.stringify(addProducts),
        };
        console.log(addProducts, 'adddddddddddd');
        fetch("http://localhost:8765/apis/products/add", addProductss).then( (res) => res.json())
        .then(()=> {
        addProducts.map(d=>{
        db.collection("products")
        .doc({ id: parseInt(d.id) })
        .update({
            sync_type: 0,
        })
    })
    });
    }

    }, [addProducts]);
    useEffect(() => {
        if(editCustomer.length>0){
        const editCustomerss = {
            method: "POST",
            headers: {
                "Access-Control-Allow-Headers": "*",
                "API-AUTH-TOKEN": props.token,
                "API-RESPONSE-FORMAT": "application/json",
                "Content-Type": "application/json",
            },
            body: JSON.stringify(editCustomer),
        };

        fetch("http://localhost:8765/apis/customers/edit", editCustomerss).then(
            (res) => {
               return res.json();
            }
        ).then(()=> {
            editCustomer.map(d=>{
            db.collection("customers")
            .doc({ id: parseInt(d.id) })
            .update({
                sync_type: 0,
            })
        })
        });
    }
    }, [editCustomer]);
    useEffect(() => {
        if(delProduct.length>0){
        const deleteProductss = {
            method: "POST",
            headers: {
                "Access-Control-Allow-Headers": "*",
                "API-AUTH-TOKEN": props.token,
                "API-RESPONSE-FORMAT": "application/json",
                "Content-Type": "application/json",
            },
            body: JSON.stringify(delProduct),
        };
        fetch(
            "http://localhost:8765/apis/products/delete",
            deleteProductss
        ).then((res) => {
           return res.json();
        }).then(()=> {
            delProduct.map(d=>{
            db.collection("products")
            .doc({ id: parseInt(d.id) })
            .update({
                sync_type: 0,
            })
        })
        });
    }
    }, [delProduct])

    useEffect(() => {
        if(addCustomers.length>0){
        const addCustomerss = {
            method: "POST",
            headers: {
                "Access-Control-Allow-Headers": "*",
                "API-AUTH-TOKEN": props.token,
                "API-RESPONSE-FORMAT": "application/json",
                "Content-Type": "application/json",
            },
            body: JSON.stringify(addCustomers),
        };
        fetch("http://localhost:8765/apis/customers/add", addCustomerss).then(
            (res) => {
               return res.json();
            }
        ).then(()=> {
            addCustomers.map(d=>{
            db.collection("customers")
            .doc({ id: parseInt(d.id) })
            .update({
                sync_type: 0,
            })
        })
        });
    }
    }, [addCustomers]);

    useEffect(() => {
        if(delCustomers.length>0){
        const deleteCustomerss = {
            method: "POST",
            headers: {
                "Access-Control-Allow-Headers": "*",
                "API-AUTH-TOKEN": props.token,
                "API-RESPONSE-FORMAT": "application/json",
                "Content-Type": "application/json",
            },
            body: JSON.stringify(delCustomers),
        };
        fetch(
            "http://localhost:8765/apis/customers/delete",
            deleteCustomerss
        ).then((res) => res.json())
        .then(()=> {
            delCustomers.map(d=>{
            db.collection("customers")
            .doc({ id: parseInt(d.id) })
            .update({
                sync_type: 0,
            })
        })
        });
    }
    }, [delCustomers]);

    useEffect(() => {
        if(editProduct.length>0){
        const editProductss = {
            method: "POST",
            headers: {
                "Access-Control-Allow-Headers": "*",
                "API-AUTH-TOKEN": props.token,
                "API-RESPONSE-FORMAT": "application/json",
                "Content-Type": "application/json",
            },
            body: JSON.stringify(editProduct),
        };
        console.log(editProduct, 'edittttttttt');
        fetch("http://localhost:8765/apis/products/edit", editProductss).then((res) => res.json())
        .then(()=> {
            editProduct.map(d=>{
            db.collection("products")
            .doc({ id: parseInt(d.id) })
            .update({
                sync_type: 0,
            })
        })
        });
    }
    }, [editProduct])

    return (
        <div className="pos">
            <div className="pos-topheader">
                <div className="pos-branding">
                    <img
                        src="/point_of_sale/static/src/img/logo.png"
                        alt="Logo"
                        className="pos-logo"
                    />
                    <div
                        className="ticket-button"
                        onClick={() => History.push("/Orders")}
                    >
                        <div badge="1" className="with-badge">
                            <i>
                                <FaTicketAlt
                                    className="fa1"
                                    aria-hidden="true"
                                />
                                <div
                                    style={{
                                        width: 21,
                                        height: 15,
                                        backgroundColor: "#01a09d",
                                        borderRadius: 20,
                                        position: "absolute",
                                        marginTop: -21,
                                        marginLeft: 6,
                                        color: "white",
                                        display: "flex",
                                        justifyContent: "center",
                                    }}
                                >
                                    <p style={{ fontSize: 10 }}>1</p>
                                </div>
                            </i>

                            <div style={{ marginLeft: 5 }}>Orders</div>
                        </div>
                    </div>
                </div>
                <div className="pos-rightheader">
                    <div className="search-bar-portal">
                        <div className="search-box">
                            <span className="icon">
                                <FaSearch className="fa" aria-hidden="true" />
                            </span>

                            <input
                                type="search"
                                placeholder="Search Products..."
                                value={value}
                                onChange={(e) => onSearchFilter(e.target.value)}
                            />
                        </div>
                    </div>
                    <div className="status-buttons-portal">
                        <div className="status-buttons">
                            <div className="oe_status">
                                <span className="username">Sudosol</span>
                            </div>
                            <div className="oe_status">
                                <div className="js_connected oe_icon oe_green">
                                    <FaWifi
                                        className="fa fa-fw"
                                        title="Synchronisation Connected"
                                        aria-label="Synchronisation Connected"
                                    />
                                </div>
                            </div>

                            <div className="oe_status" onClick={onSync}>
                                <FaSyncAlt
                                    title="Synchronisation"
                                    style={{ color: "white" }}
                                />
                            </div>
                            <div
                                className=" header-button close_button"
                                onClick={() => {
                                    //cookies.remove("user");
                                    // removeCookie('userId');
                                    removeCookie("userId");
                                    removeCookie1("userToken");
                                    window.location.assign("/login");
                                    // History.push('/login')
                                    console.log("cookieRemoved");
                                }}
                            >
                                Log out
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
const mapStateToProps = (state) => {
    return {
        value: state.srch.searchValue,
        token: state.srch.token,
    };
};
const mapDispatchToProps = (dispatch) => ({
    // dispatching actions returned by action creators
    onSearchFilter: (value) => dispatch(searchFilter(value)),
});
export default connect(mapStateToProps, mapDispatchToProps)(Header);
