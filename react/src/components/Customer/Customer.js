import React, { useState, useEffect, Fragment, Children } from "react";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { editCustomer, menuUpdate } from "../../store/actions";
import { setCustomer } from "../../store/actions";
import "../../Assets/style/style.scss";
import { Table, Button, Container, Row, Col } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/js/src/collapse.js";
import Localbase from "localbase";
import Selector from "../UIComponents/Selector/Selector";
import History from "../../Navigation/History";
import SelectInput from "../UIComponents/SelectInput/SelectInput";
import Paginator from "../UIComponents/Paginator/Paginator";
import { FaTrashAlt, FaEdit, FaSearch } from "react-icons/fa";
import Menu from "../Menu/Menu";

const records = ["10", "20", "30", "40", "50", "60", "70"];
const Customer = (props) => {
    let db = new Localbase("db");
    const [customerData, setCustomerData] = useState([]);
    const [mounted, setMounted] = useState(false);
    const [selectedItems, setSelectedItems] = useState(records[0]);
    const handleChange = (item) => {
        setSelectedItems(item);
    };

    console.log(selectedItems, "recordsss");

    if (!mounted) {
        db.collection("customers")
            .get()
            .then((customerss) => {
                console.log(customerss, "customerdb");
                setCustomerData(customerss);
            });
    }
    useEffect(() => {
        setMounted(true);
    }, []);

    const onEditCustmer = (id, e) => {
        e.stopPropagation();
        History.push(`/editcustomer/${id}`);
    };

    const onDeleteCustmer = (id, e) => {
        e.stopPropagation();
        db.collection("customers")
            .doc({ id: parseInt(id) })
            .update({
                sync_type: 3,
            })
            .then(() =>
                setCustomerData((prevData) =>
                    prevData.filter((d) => d.id !== id)
                )
            );
    };

    const [offset, setOffset] = useState(0);
    const [currentPage, setCurrentPage] = useState(0);
    const [search, setSearch] = useState("");

    const onSearch = (e) => {
        setSearch(e.target.value);
        if (!e.target.value) {
            return db
                .collection("customers")
                .get()
                .then((d) => setCustomerData(d));
        }

        const filtered = customerData.filter((d) =>
            d.first_name.toLowerCase().includes(e.target.value.toLowerCase())
        );
        setCustomerData(filtered);
    };

    let perPage;
    let slice = [];
    let pageCount;
    if (customerData.length > 0) {
        perPage = selectedItems;
        pageCount = Math.ceil(customerData.length / perPage);
        slice = customerData.slice(offset, offset + perPage);
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
                                <h1 className="Title">Customers</h1>
                                <div className="search-box">
                                    <input
                                        type="search"
                                        placeholder="Search Customers..."
                                        value={search}
                                        onChange={(e) => onSearch(e)}
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
                                            onClick={() =>
                                                History.push("/AddCustomer")
                                            }
                                        >
                                            Create
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
                                            <th>Name</th>
                                            <th>Adress</th>
                                            <th>Phone</th>
                                            <th>Emails</th>
                                            <th>Edit</th>
                                            <td></td>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {slice.map((d) => (
                                            <>
                                                <tr
                                                    className="body-row"
                                                    key={d.id}
                                                    onClick={() => {
                                                        props.onSetCustomer(d);
                                                        props.onMenuUpdate(
                                                            "home"
                                                        );
                                                        History.push("/");
                                                    }}
                                                >
                                                    <td>{d.first_name}</td>

                                                    <td>
                                                        {
                                                            d.address
                                                                .street_line_1
                                                        }
                                                    </td>
                                                    <td>
                                                        {d.address.phone_number}
                                                    </td>
                                                    <td>{d.email}</td>
                                                    <td>
                                                        <Button
                                                            variant="link"
                                                            onClick={(e) =>
                                                                onEditCustmer(
                                                                    d.id,
                                                                    e
                                                                )
                                                            }
                                                        >
                                                            <FaEdit className="del-icon" />
                                                        </Button>
                                                    </td>
                                                    <td>
                                                        <Button
                                                            variant="link"
                                                            onClick={(e) =>
                                                                onDeleteCustmer(
                                                                    d.id,
                                                                    e
                                                                )
                                                            }
                                                        >
                                                            <FaTrashAlt className="del-icon" />
                                                        </Button>
                                                    </td>
                                                </tr>
                                            </>
                                        ))}
                                    </tbody>
                                </Table>

                                <div className="bg-paginator">
                                    <Paginator
                                        pageCount={pageCount}
                                        pageRangeDisplayed={4}
                                        marginPagesDisplayed={1}
                                        onPageChange={handleClick}
                                    />
                                    <div style={{ display: "flex" }}>
                                        <button className="recordbtn">
                                            Total Customers:{" "}
                                            {customerData.length}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Container>
                </Col>
            </Row>
        </Container>
    );
};
const mapStateToProps = (state) => {
    return {
        value: state.srch.token,
    };
};
const mapDispatchToProps = (dispatch) => ({
    onEditAction: (value, token, pushPAge) =>
        dispatch(editCustomer(value, token, pushPAge)),
    onSetCustomer: (value) => dispatch(setCustomer(value)),
    onMenuUpdate: (value) => dispatch(menuUpdate(value)),
});
export default withRouter(
    connect(mapStateToProps, mapDispatchToProps)(Customer)
);
