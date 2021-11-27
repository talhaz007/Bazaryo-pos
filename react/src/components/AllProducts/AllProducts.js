import React, { useState, useEffect } from "react";
import { Table, Button, Container, Row, Col } from "react-bootstrap";
import Menu from "../Menu/Menu";
import { menuUpdate } from "../../store/actions";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/js/src/collapse.js";
import Localbase from "localbase";
import History from "../../Navigation/History";
import "../../Assets/style/style.scss";
import Paginator from "../UIComponents/Paginator/Paginator";
import SelectInput from "../UIComponents/SelectInput/SelectInput";
import { FaTrashAlt, FaEdit, FaSearch } from "react-icons/fa";
import { connect } from "react-redux";
import Barcode from "react-barcode";
import { useBarcode } from "react-barcodes";

const records = ["10", "20", "30", "40", "50", "60", "70"];
const AllProducts = (props) => {
    let db = new Localbase("db");
    const [mounted, setMounted] = useState(false);
    const [offset, setOffset] = useState(0);
    const [currentPage, setCurrentPage] = useState(0);
    const [productData, setProductData] = useState([]);
    const [search, setSearch] = useState("");
    const [selectedItems, setSelectedItems] = useState(records[0]);
    const handleChange = (item) => {
        setSelectedItems(item);
    };

    console.log(currentPage);

    if (!mounted) {
        db.collection("products")
            .get()
            .then((productdb) => {
                console.log(productdb, "consoledb");
                setProductData(productdb);
            });
    }

    useEffect(() => {
        setMounted(true);
    }, []);

    const onEditProduct = (id) => {
        History.push(`/editproduct/${id}`);
    };

    const onDeleteProduct = (id) => {
        // db.collection("products")
        //     .doc({ id: parseInt(id) })
        //     .update({
        //         sync_type: 3,
        //     });
        db.collection("products")
            .doc({ id: parseInt(id) })
            .update({
                sync_type: 3,
            })
            .then(() =>
                setProductData((prevData) =>
                    prevData.filter((d) => d.id !== id)
                )
            );
    };

    const onSearch = (e) => {
        setSearch(e.target.value);
        if (!e.target.value) {
            return db
                .collection("products")
                .get()
                .then((d) => setProductData(d));
        }

        const filtered = productData.filter((d) =>
            d.title.toLowerCase().includes(e.target.value.toLowerCase())
        );
        setProductData(filtered);
    };

    let perPage;
    let slice = [];
    let pageCount;
    if (productData.length > 0) {
        perPage = selectedItems;
        pageCount = Math.ceil(productData.length / perPage);
        slice = productData.slice(offset, offset + perPage);
    }
    const handleClick = (e) => {
        const selectedPage = e.selected;
        const newOffset = selectedPage * perPage;
        setOffset(newOffset);
        setCurrentPage(selectedPage);
    };

    // const { inputRef } = useBarcode({
    //     value: productData.map((d) => d.barcode),
    //     options: {
    //         background: "white",
    //     },
    // });

    return (
        <Container fluid>
            <Row>
                <Menu />
                <Col xs="11" className="all-wrapper">
                    <Container fluid>
                        <Row>
                            <Col xs="12">
                                <div className="main-conatiner">
                                    <div className="title-wrap">
                                        <h1 className="Title">Products</h1>
                                        <div className="search-box">
                                            <input
                                                type="search"
                                                placeholder="Search Products..."
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
                                                        History.push(
                                                            "/addproduct"
                                                        )
                                                    }
                                                >
                                                    Add
                                                </button>
                                                <button
                                                    className="top-button"
                                                    onClick={() => {
                                                        props.onMenuUpdate(
                                                            "home"
                                                        );
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
                                                    <th>Title</th>
                                                    <th>Price</th>
                                                    <th>Tax</th>
                                                    <th>Barcode</th>
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
                                                        >
                                                            <td>{d.title}</td>
                                                            <td>
                                                                <sup>Rs</sup>
                                                                {d.price}
                                                            </td>
                                                            <td>{d.tax}</td>
                                                            <td>{d.barcode}</td>
                                                            <td>
                                                                <Button
                                                                    variant="link"
                                                                    onClick={() =>
                                                                        onEditProduct(
                                                                            d.id
                                                                        )
                                                                    }
                                                                >
                                                                    <FaEdit className="del-icon" />
                                                                </Button>
                                                            </td>
                                                            <td>
                                                                <Button
                                                                    variant="link"
                                                                    onClick={() =>
                                                                        onDeleteProduct(
                                                                            d.id
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
                                            <button className="recordbtn">
                                                Total Products:{" "}
                                                {productData.length}
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </Col>
                        </Row>
                    </Container>
                </Col>
            </Row>
        </Container>
    );
};

const mapDispatchToProps = (dispatch) => ({
    onMenuUpdate: (value) => dispatch(menuUpdate(value)),
});

export default connect(null, mapDispatchToProps)(AllProducts);
