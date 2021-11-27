import React from "react";
import { Col, Container, Row } from "react-bootstrap";
import Logo from "../../Assets/img/logo.png";
import History from "../../Navigation/History";
import "./LogIn.scss";

function ResetPas() {
    return (
        <Container fluid className="bg-style">
            <Row>
                <Col sm="12" className="d-flex">

        <div class="martop">
            <div class="login-page">
                <div class="form">
                    <div class="border-bottom">
                        <img class="logo" src={Logo} alt="" />
                    </div>
                    <form class="login-form">
                        <label>
                            <b>Your Email</b>
                        </label>
                        <input type="text" placeholder="Email" />
                        <button>Confirm</button>
                        <div class=" margint">
                            <div
                                class="message"
                                onClick={() => History.push("/login")}
                            >
                                Back to login
                            </div>
                            <hr class="hr-style" />
                        </div>
                        <div class="message marginlr">Powered by Sudosol</div>
                    </form>
                </div>
            </div>
        </div>
        </Col>
        </Row>
        </Container>
    );
}

export default ResetPas;
