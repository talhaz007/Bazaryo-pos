import React, { useState, useEffect, Fragment } from "react";
import { Col, Spinner } from "react-bootstrap";
import {
    FaRegUser,
    FaTicketAlt,
    FaSignOutAlt,
    FaSyncAlt,
} from "react-icons/fa";
import { AiTwotoneHome } from "react-icons/ai";
import { connect } from "react-redux";
import { menuUpdate } from "../../store/actions";
import Localbase from "localbase";
import Sidebar from "react-sidebar";
import { useCookies } from "react-cookie";
import { MdAddShoppingCart, MdImportantDevices } from "react-icons/md";
import { ImMenu3 } from "react-icons/im";
import { AiFillSetting } from "react-icons/ai";
import logo from "../../Assets/img/applogo.jpg";
import History from "../../Navigation/History";
import "../../Assets/style/style.scss";

const Menu = (props) => {
    let db = new Localbase("db");
    const { value, onSearchFilter } = props;
    const [loading, setLoading] = useState(false);
    const [cookies, setCookie, removeCookie] = useCookies(["user"]);
    const [cookiess, setCookiess] = useCookies(["userId"]);
    const [addCustomers, setAddCustomers] = useState([]);
    const [selectedMenu, setSelectedMenu] = useState("");
    const [editCustomer, setEditCustomer] = useState([]);
    const [delCustomers, setDelCustomers] = useState([]);
    const [addProducts, setAddProducts] = useState([]);
    const [editProduct, setEditProduct] = useState([]);
    const [delProduct, setDelProduct] = useState([]);
    const [addOrder, setAddOrder] = useState([]);
    const [editUser, setEditUser] = useState([]);
    const [delOrder, setDelOrder] = useState([]);
    const [cookies1, setCookie1, removeCookie1] = useCookies(["userToken"]);
    const [burgerMenu, setBurgerMenu] = useState(false);

    console.log(props.token, "tokennnn");

    console.log(window.location.host, "hostnameee");

    const onSync = async () => {
        setLoading(!loading);
        setTimeout(() => {
            setLoading(loading);
        }, 4000);

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

        console.log(props.token, "toknnnn");

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

        //setting users
        let editU = [];

        //users setup
        let userResponse = await db
            .collection("user")
            .get()
            .then((editusers) => {
                console.log(editusers, "edituserss");
                editusers.map((d) => {
                    if (d.sync_type === 2) {
                        editU.push(d);
                        console.log(editU, "editing userss");
                    }
                });
            });
        setEditUser(editU);
        console.log(userResponse, "userss response");

        console.log("syningggg");
    };

    useEffect(() => {
        if (addOrder.length > 0) {
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
            fetch(`${props.baseurl}/apis/orders/add`, addOrderss)
                .then((res) => {
                    return res.json();
                })
                .then(() => {
                    addOrder.map((d) => {
                        db.collection("orders")
                            .doc({ id: parseInt(d.id) })
                            .update({
                                sync_type: 0,
                            });
                    });
                });
        }
    }, [addOrder]);

    useEffect(() => {
        if (addProducts.length > 0) {
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
            console.log(addProducts, "adddddddddddd");
            fetch(`${props.baseurl}/apis/products/add`, addProductss)
                .then((res) => res.json())
                .then(() => {
                    addProducts.map((d) => {
                        db.collection("products")
                            .doc({ id: parseInt(d.id) })
                            .update({
                                sync_type: 0,
                            });
                    });
                });
        }
    }, [addProducts]);
    useEffect(() => {
        if (editCustomer.length > 0) {
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

            fetch(`${props.baseurl}/apis/customers/edit`, editCustomerss)
                .then((res) => {
                    return res.json();
                })
                .then(() => {
                    editCustomer.map((d) => {
                        db.collection("customers")
                            .doc({ id: parseInt(d.id) })
                            .update({
                                sync_type: 0,
                            });
                    });
                });
        }
    }, [editCustomer]);
    useEffect(() => {
        if (delProduct.length > 0) {
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
            fetch(`${props.baseurl}/apis/products/delete`, deleteProductss)
                .then((res) => {
                    return res.json();
                })
                .then(() => {
                    delProduct.map((d) => {
                        db.collection("products")
                            .doc({ id: parseInt(d.id) })
                            .update({
                                sync_type: 0,
                            });
                    });
                });
        }
    }, [delProduct]);

    useEffect(() => {
        if (addCustomers.length > 0) {
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
            fetch(
                `${props.baseurl}/apis/customers/add?id=${cookiess.userId}`,
                addCustomerss
            )
                .then((res) => {
                    return res.json();
                })
                .then(() => {
                    addCustomers.map((d) => {
                        db.collection("customers")
                            .doc({ id: parseInt(d.id) })
                            .update({
                                sync_type: 0,
                            });
                    });
                });
        }
    }, [addCustomers]);

    useEffect(() => {
        if (delCustomers.length > 0) {
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
            fetch(`${props.baseurl}/apis/customers/delete`, deleteCustomerss)
                .then((res) => res.json())
                .then(() => {
                    delCustomers.map((d) => {
                        db.collection("customers")
                            .doc({ id: parseInt(d.id) })
                            .update({
                                sync_type: 0,
                            });
                    });
                });
        }
    }, [delCustomers]);

    useEffect(() => {
        if (editProduct.length > 0) {
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
            console.log(editProduct, "edittttttttt");
            fetch(`${props.baseurl}/apis/products/edit`, editProductss)
                .then((res) => res.json())
                .then(() => {
                    editProduct.map((d) => {
                        db.collection("products")
                            .doc({ id: parseInt(d.id) })
                            .update({
                                sync_type: 0,
                            });
                    });
                });
        }
    }, [editProduct]);

    useEffect(() => {
        if (editUser.length > 0) {
            const editUserss = {
                method: "POST",
                headers: {
                    "Access-Control-Allow-Headers": "*",
                    "API-RESPONSE-FORMAT": "application/json",
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(editUser),
            };
            fetch(
                `${props.baseurl}/apis/users/edit?id=${cookiess.userId}`,
                editUserss
            )
                .then((res) => res.json())
                .then(() => {
                    editUser.map((d) => {
                        db.collection("user")
                            .doc({ id: parseInt(cookiess.userId) })
                            .update({
                                sync_type: 0,
                            });
                    });
                });
        }
    }, [editUser]);

    useEffect(() => {
        const interval = setInterval(() => {
            if (props.internetStatus === false) {
                onSync();
            }
        }, 300000);
        return () => clearInterval(interval);
    }, []);

    const openBurgerMenu = () => {
        setBurgerMenu(!burgerMenu);
    };

    return (
        <Fragment>
            <Col xs="1" className="sidemenu-wrapper showMenu">
                <div>
                    <div className="text-center">
                        <img src={logo} className="logo" />
                    </div>
                    <div
                        className="flex"
                        onClick={() => {
                            props.onMenuUpdate("home");
                            History.push("/");
                        }}
                    >
                        <div
                            className={
                                props.menuVal === "home"
                                    ? "selected"
                                    : `icons-wrap`
                            }
                        >
                            <AiTwotoneHome className="icon-style" />
                            <div className="menu-text">Home</div>
                        </div>
                    </div>
                    <div
                        className="flex"
                        onClick={() => {
                            props.onMenuUpdate("products");
                            History.push("/allproducts");
                        }}
                    >
                        <div
                            className={
                                props.menuVal === "products"
                                    ? "selected"
                                    : `icons-wrap`
                            }
                        >
                            <MdAddShoppingCart className="icon-style" />
                            <div className="menu-text">Products</div>
                        </div>
                    </div>

                    <div
                        className="flex"
                        onClick={() => {
                            props.onMenuUpdate("customer");
                            History.push("/customer");
                        }}
                    >
                        <div
                            className={
                                props.menuVal === "customer"
                                    ? "selected"
                                    : `icons-wrap`
                            }
                        >
                            <FaRegUser className="icon-style" />
                            <div className="menu-text">Customers</div>
                        </div>
                    </div>

                    <div
                        className="flex"
                        onClick={() => {
                            props.onMenuUpdate("orders");
                            History.push("/orders");
                        }}
                    >
                        <div
                            className={
                                props.menuVal === "orders"
                                    ? "selected"
                                    : `icons-wrap`
                            }
                        >
                            <FaTicketAlt className="icon-style" />
                            <div className="menu-text">Orders</div>
                        </div>
                    </div>

                    <div
                        className="flex"
                        onClick={() => {
                            props.onMenuUpdate("setting");
                            History.push("/edituser");
                        }}
                    >
                        <div
                            className={
                                props.menuVal === "setting"
                                    ? "selected"
                                    : `icons-wrap`
                            }
                        >
                            <AiFillSetting className="icon-style" />
                            <div className="menu-text">settings</div>
                        </div>
                    </div>
                    <div
                        className="flex"
                        onClick={() => props.onMenuUpdate("sync")}
                    >
                        <button
                            className={
                                props.menuVal === "sync"
                                    ? "selected"
                                    : `icons-wrap`
                            }
                            onClick={onSync}
                            disabled={loading}
                        >
                            {loading && <Spinner animation="border" />}
                            {loading && (
                                <div className="menu-text">Syncing</div>
                            )}
                            {!loading && <FaSyncAlt className="icon-style" />}
                            {!loading && <div className="menu-text">Sync</div>}
                        </button>
                    </div>
                    <div
                        className="flex"
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
                        <div className="icons-wrap mt">
                            <FaSignOutAlt className="icon-style" />
                            <div className="menu-text">Log out</div>
                        </div>
                    </div>
                </div>
            </Col>
            <Col xs="1" className="HideMenu">
                <ImMenu3
                    onClick={() => openBurgerMenu()}
                    style={{ fontSize: "25px" }}
                />

                <Sidebar
                    open={burgerMenu}
                    onSetOpen={openBurgerMenu}
                    rootClassName="root-bar-styling"
                    sidebarClassName="side-bar-styling"
                    sidebar={
                        <div className="sidemenu-wrapper Hiddenburger">
                            <div>
                                <div className="text-center">
                                    <img src={logo} className="logo" />
                                </div>
                                <div
                                    className="flex"
                                    onClick={() => {
                                        props.onMenuUpdate("home");
                                        History.push("/");
                                    }}
                                >
                                    <div
                                        className={
                                            props.menuVal === "home"
                                                ? "selected"
                                                : `icons-wrap`
                                        }
                                    >
                                        <AiTwotoneHome className="icon-style" />
                                        <div className="menu-text">Home</div>
                                    </div>
                                </div>
                                <div
                                    className="flex"
                                    onClick={() => {
                                        props.onMenuUpdate("products");
                                        History.push("/allproducts");
                                    }}
                                >
                                    <div
                                        className={
                                            props.menuVal === "products"
                                                ? "selected"
                                                : `icons-wrap`
                                        }
                                    >
                                        <MdAddShoppingCart className="icon-style" />
                                        <div className="menu-text">
                                            Products
                                        </div>
                                    </div>
                                </div>

                                <div
                                    className="flex"
                                    onClick={() => {
                                        props.onMenuUpdate("customer");
                                        History.push("/customer");
                                    }}
                                >
                                    <div
                                        className={
                                            props.menuVal === "customer"
                                                ? "selected"
                                                : `icons-wrap`
                                        }
                                    >
                                        <FaRegUser className="icon-style" />
                                        <div className="menu-text">
                                            Customers
                                        </div>
                                    </div>
                                </div>

                                <div
                                    className="flex"
                                    onClick={() => {
                                        props.onMenuUpdate("orders");
                                        History.push("/orders");
                                    }}
                                >
                                    <div
                                        className={
                                            props.menuVal === "orders"
                                                ? "selected"
                                                : `icons-wrap`
                                        }
                                    >
                                        <FaTicketAlt className="icon-style" />
                                        <div className="menu-text">Orders</div>
                                    </div>
                                </div>

                                <div
                                    className="flex"
                                    onClick={() => {
                                        props.onMenuUpdate("setting");
                                        History.push("/edituser");
                                    }}
                                >
                                    <div
                                        className={
                                            props.menuVal === "setting"
                                                ? "selected"
                                                : `icons-wrap`
                                        }
                                    >
                                        <AiFillSetting className="icon-style" />
                                        <div className="menu-text">
                                            settings
                                        </div>
                                    </div>
                                </div>
                                <div
                                    className="flex"
                                    onClick={() => props.onMenuUpdate("sync")}
                                >
                                    <button
                                        className={
                                            props.menuVal === "sync"
                                                ? "selected"
                                                : `icons-wrap`
                                        }
                                        onClick={onSync}
                                        disabled={loading}
                                    >
                                        {loading && (
                                            <Spinner animation="border" />
                                        )}
                                        {loading && (
                                            <div className="menu-text">
                                                Syncing
                                            </div>
                                        )}
                                        {!loading && (
                                            <FaSyncAlt className="icon-style" />
                                        )}
                                        {!loading && (
                                            <div className="menu-text">
                                                Sync
                                            </div>
                                        )}
                                    </button>
                                </div>
                                <div
                                    className="flex"
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
                                    <div className="icons-wrap mt">
                                        <FaSignOutAlt className="icon-style" />
                                        <div className="menu-text">Log out</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    }
                ></Sidebar>
            </Col>
        </Fragment>
    );
};
const mapStateToProps = (state) => {
    return {
        value: state.srch.searchValue,
        token: state.srch.token,
        menuVal: state.srch.menu,
        baseurl: state.srch.baseurl,
        internetStatus: state.srch.offline,
    };
};

const mapDispatchToProps = (dispatch) => ({
    onMenuUpdate: (value) => dispatch(menuUpdate(value)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Menu);
