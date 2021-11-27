import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import { FaSearch, FaChevronDown, FaTrashAlt } from "react-icons/fa";
import { Container, Table, Row, Col } from "react-bootstrap";
import { menuUpdate } from "../../store/actions";
import History from "../../Navigation/History";
import Paginator from "../UIComponents/Paginator/Paginator";
import Localbase from "localbase";
import "bootstrap/dist/css/bootstrap.min.css";
import SelectInput from "../UIComponents/SelectInput/SelectInput";
import { useCookies } from "react-cookie";
import "bootstrap/js/src/collapse.js";
import Menu from "../Menu/Menu";
import "../../Assets/style/style.scss";

const records = ["10", "20", "30", "40", "50", "60", "70"];
function Orders(props) {
    let db = new Localbase("db");
    const [cookies, setCookie] = useCookies(["userId"]);
    const [mounted, setMounted] = useState(false);
    const [offset, setOffset] = useState(0);
    const [currentPage, setCurrentPage] = useState(0);
    const [showMenu, setShowMenu] = useState(false);
    const [searchOrder, setSearOrder] = useState("");
    const [ordersData, setOrdersData] = useState([]);
    const [userdata, setUserData] = useState([]);
    const [search, setSearch] = useState("");

    const [selectedItems, setSelectedItems] = useState(records[0]);
    const handleChange = (value) => {
        setSelectedItems(value);
    };
    if (!mounted) {
        db.collection("orders")
            .get()
            .then((ordersdb) => {
                console.log(ordersdb, "ordersdbb");
                setOrdersData(ordersdb);
            });
        db.collection("user")
            .get()
            .then((usersdb) => {
                // console.log(usersdb, "usrssss");
                setUserData(usersdb);
            });
    }

    useEffect(() => {
        setMounted(true);
    }, []);

    const [orders, setOrders] = useState(ordersData);

    const OnSearchOrder = (e) => {
        setSearOrder(e.target.value);
        if (!e.target.value) {
            return db
                .collection("orders")
                .get()
                .then((d) => setOrdersData(d));
        }

        const filtered = ordersData.filter((d) =>
            d.customer_firstname
                .toLowerCase()
                .includes(e.target.value.toLowerCase())
        );

        setOrdersData(filtered);
    };

    const onDeleteButton = (id) => {
        db.collection("orders")
            .doc({ id: parseInt(id) })
            .update({
                sync_type: 3,
            });
    };

    const onTicketChange = () => {
        setOrders(ordersData);
    };

    const onStatusChange = () => {
        const filtered = ordersData.filter((d) => d.state_name === "Ongoing");

        setOrders(filtered);
    };

    const onPymentStatus = () => {
        const filtered = ordersData.filter((d) => d.state_name === "Payment");

        setOrders(filtered);
    };

    const onReceiptStatus = () => {
        const filtered = ordersData.filter((d) => d.state_name === "Receipt");

        setOrders(filtered);
    };
    let perPage;
    let slice = [];
    let pageCount;
    if (ordersData.length > 0) {
        perPage = selectedItems;
        pageCount = Math.ceil(ordersData.length / perPage);
        slice = ordersData.slice(offset, offset + perPage);
    }
    const handleClick = (e) => {
        const selectedPage = e.selected;
        const newOffset = selectedPage * perPage;
        setOffset(newOffset);
        setCurrentPage(selectedPage);
    };

    return (
        <Container fluid>
            <Row>
                <Menu />
                <Col xs="11" className="all-wrapper">
                    <Container fluid>
                        <div className="main-conatiner">
                            <div className="title-wrap">
                                <h1 className="Title">Orders</h1>
                                <div className="search-box">
                                    <input
                                        type="search"
                                        placeholder="Search Orders..."
                                    />
                                    <span className="icon">
                                        <FaSearch
                                            className="fa"
                                            aria-hidden="true"
                                        />
                                    </span>
                                </div>
                            </div>
                            <div className="screen-content">
                                <div className="top-content">
                                    <div
                                        style={{
                                            display: "flex",
                                            flexWrap: "wrap",
                                        }}
                                    >
                                        <button
                                            className="top-button"
                                            onClick={() => {
                                                props.onMenuUpdate("home");
                                                History.push("/");
                                            }}
                                        >
                                            New Order
                                        </button>
                                        <button
                                            className="top-button"
                                            onClick={() => {
                                                props.onMenuUpdate("home");
                                                History.push("/");
                                            }}
                                        >
                                            Discard
                                        </button>
                                    </div>
                                    <SelectInput
                                        name="Records"
                                        placeHolder="Records per Page"
                                        options={records}
                                        selectedValue={selectedItems}
                                        onChange={(item) => {
                                            handleChange(item);
                                        }}
                                    />
                                </div>
                                <Table hover responsive>
                                    <thead className="header-row">
                                        <tr>
                                            <td>Date</td>
                                            <td>Receipt Number</td>
                                            <td>Customer</td>
                                            <td>Employee</td>
                                            <td>Total</td>
                                            <td>Status</td>
                                            <td></td>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {slice
                                            ? slice.map((d) => (
                                                  <tr
                                                      className="body-row"
                                                      key={d.id}
                                                  >
                                                      <td>{d.purchase_date}</td>
                                                      <td>
                                                          Order 00001-003-0005
                                                      </td>
                                                      <td>
                                                          {d.customer_firstname}
                                                      </td>
                                                      <td>
                                                          {" "}
                                                          {userdata.length > 0
                                                              ? userdata[0]
                                                                    .first_name
                                                              : "name"}
                                                      </td>
                                                      <td>
                                                          <sup>Rs</sup>100
                                                      </td>
                                                      <td>{d.state_name}</td>
                                                      <td>
                                                          <span>
                                                              <FaTrashAlt
                                                                  className="del-icon"
                                                                  onClick={() =>
                                                                      onDeleteButton(
                                                                          d.id
                                                                      )
                                                                  }
                                                              />
                                                          </span>
                                                      </td>
                                                  </tr>
                                              ))
                                            : ""}
                                    </tbody>
                                </Table>
                                <div className="bg-paginator">
                                    <Paginator
                                        pageCount={pageCount}
                                        pageRangeDisplayed={4}
                                        marginPagesDisplayed={1}
                                        onPageChange={handleClick}
                                    />
                                    <button className="recordbtn">
                                        Total Orders: {ordersData.length}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </Container>
                </Col>
            </Row>
        </Container>
    );
}
const mapStateToProps = (state) => {
    return {
        value: state.srch.token,
    };
};
const mapDispatchToProps = (dispatch) => ({
    onMenuUpdate: (value) => dispatch(menuUpdate(value)),
});
export default connect(mapStateToProps, mapDispatchToProps)(Orders);
