import React, {useState, useEffect} from 'react';
import {connect} from 'react-redux';
import {orderSuccess} from '../../store/actions';
import History from '../../Navigation/History';
import {FaAngleDoubleLeft, FaAngleDoubleRight, FaBackspace, FaUser} from 'react-icons/fa';
import './Pay.scss';

const Pay = (props) => {
    const [numPadCount, setNumPadCount] = useState("");
    const [cash, setCash] = useState();
    const [change, setChange] = useState();

    const onCalculatorPress = (num) => {
            setNumPadCount(numPadCount + num);
            console.log(numPadCount);
    };

   
    const onBackSpace = () => {
         setNumPadCount(numPadCount.substring(0, numPadCount.length - 1));
         console.log(numPadCount);
    }
    useEffect(() => {
        setCash(numPadCount);
    }, [numPadCount]);
    useEffect(() => {
        let change= cash-props.total<0? 0 :cash-props.total;
        props.onOrderSuccess(cash, change)
    }, [cash]);

    const onOrderSuccess= () => {
        const requestOptions = {
            method:'POST',
            headers: {
                'Access-Control-Allow-Headers': '*',
                "API-AUTH-TOKEN": props.value,
                'API-RESPONSE-FORMAT': 'application/json',
                'Content-Type' : 'application/json'
            },
            body:JSON.stringify({ 
                        "external_order_identifier":"699",
                        "customer_id":props.customer.id||null,
                        "core_account_id":"1",
                        "language_code":1,
                        "state_code":"processing",
                        "state_name":"Processing",
                        "status_code":"completed",
                        "status_name":"Completed",
                        "customer_title":"Mr",
                        "customer_firstname":props.customer.first_name || null,
                        "customer_lastname":props.customer.last_name || null,
                        "customer_company":props.customer.address.company || null,
                        "customer_email":props.customer.last_name || null,
                        "customer_phone":props.customer.address.phone_number || null,
                        "customer_street_1":props.customer.address.street_line_1 || null,
                        "customer_street_2":props.customer.address.street_line_2 || null,
                        "customer_postcode":props.customer.address.postal_code || null,
                        "customer_city":props.customer.address.city || null,
                        "customer_country_code":"201",
                        "customer_country_name":"Pakistan",
                        "shipping_title":"Mr",
                        "shipping_firstname":props.customer.first_name || null,
                        "shipping_lastname":props.customer.last_name || null,
                        "shipping_company":props.customer.address.company || null,
                        "shipping_street_1":props.customer.address.street_line_1 || null,
                        "shipping_street_2":props.customer.address.street_line_2 || null,
                        "shipping_postcode":props.customer.address.postal_code || null,
                        "shipping_city":props.customer.address.city || null,
                        "shipping_country_code":"201",
                        "shipping_country_name":"Pakistan",
                        "invoice_title":"Mr",
                        "invoice_firstname":props.customer.first_name || null,
                        "invoice_lastname":props.customer.last_name || null,
                        "invoice_company":props.customer.address.company || null,
                        "invoice_street_1":props.customer.address.street_line_1 || null,
                        "invoice_street_2":props.customer.address.street_line_2 || null,
                        "invoice_postcode":props.customer.address.postal_code || null,
                        "invoice_city":props.customer.address.city || null,
                        "invoice_country_code":"201",
                        "invoice_country_name":"Pakistan",
                        "currency_code":"rs",
                        "currency_name":"Rupees",
                        "payment_method_code":"100",
                        "payment_method_name":"cash", 
                        "shipping_method_code":"1", 
                        "shipping_method_name":"DHL", 
                        "purchase_date":new Date(), 
                        "external_purchase_date":new Date(), 
                        "marketplace_code":2, 
                        "marketplace_name":"magento", 
                        "marketplace_group_code":"345", 
                        "marketplace_group_name":"deldo", 
                        "account_code":"2",
                        "account_name":"cash", 
                        "external_customer_identifier":1, 
                        "seller_order_identifier":"1", 
                        "custom_field_1":null, 
                        "custom_field_2":null, 
                        "custom_field_3":null, 
                        "custom_field_4":null, 
                        "custom_field_5":null, 
                        "core_seller_id":"1", 
                        "core_user_id":"1", 
                        "core_marketplace_code":"default", 
                        "core_marketplace_name":"default", 
                        "core_marketplace_group_code":"", 
                        "core_marketplace_group_name":"", 
                        "core_order_products": props.productsData.map(d=>{
                            return {
                                "sku":d.sku, 
                            "type":d.type, 
                            "name":d.name, 
                            "single_price":d.fixedPrice, 
                            "is_price_incl_tax":0, 
                            "tax_percent":"0", 
                            "quantity":d.unit, 
                            "external_identifier":"123", 
                            "marketplace_product_identifier":"335", 
                            "external_fee_amount":0, 
                            "options":null
                            }
                        }) || null 
                    })
        };
        fetch('http://localhost:8765/apis/orders/add', requestOptions)
        .then(res=>res.json())
        .then(data=>{
            console.log(data, 'dataaaa');
           History.push('/payment');
        });
    }

    return(
        <div className="pos-content">
            <div className="window">
                <div className="subwindow">
                    <div className="subwindow-container">
                        <div className="subwindow-container-fix screens">
                            <div className="payment-screen screen">
                                <div className="screen-content">
                                    <div className="top-content">
                                        <div className="button back" onClick={()=>History.push('/')}>
                                            <FaAngleDoubleLeft/>
                                            <span className="back_text">Back</span>
                                        </div>
                                        <div className="top-content-center">
                                            <h1>Payment</h1>
                                        </div>
                                        <div className="button next highlight" onClick={()=>onOrderSuccess()}>
                                            <span className="next_text">Validate</span>
                                            <FaAngleDoubleRight/>
                                        </div>
                                    </div>
                                    <div className="main-content">
                                        <div className="left-content">
                                            <div className="paymentmethods-container">
                                                <div className="paymentlines">
                                                    <div className="paymentline selected">
                                                        <div className="payment-name">Cash</div>
                                                        <div className="payment-amount">{cash || 0}</div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="right-content">
                                            <section className="paymentlines-container">
                                                <div>
                                                    <div className="payment-status-container">
                                                        <div>
                                                            <div className="payment-status-remaining">
                                                                <span className="label">Remaining</span>
                                                                <span className="amount">$ {props.total-cash <0 ? 0 :props.total-cash}</span>
                                                            </div>
                                                            <div className="payment-status-total-due">
                                                                <span className="total">Total Due</span>
                                                                <span>$ {props.total || 0}</span>
                                                            </div>
                                                        </div>
                                                        <div>
                                                            <div className="payment-status-change">
                                                                <span className="label">Change</span>
                                                                <span className="amount">$ {cash-props.total<0? 0 :cash-props.total }</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </section>
                                            <div className="payment-button-container">
                                                <section className="payment-numpads">
                                                    <div className="numpads">
                                                        <button className="input-buttons" onClick={()=>onCalculatorPress('1')}>1</button>
                                                        <button className="input-buttons" onClick={()=>onCalculatorPress('2')}>2</button>
                                                        <button className="input-buttons" onClick={()=>onCalculatorPress('3')}>3</button>
                                                        <button className="mode-button">+10</button>
                                                        <br/>
                                                        <button className="input-buttons number-char" onClick={()=>onCalculatorPress('4')}>4</button>
                                                        <button className="input-buttons number-char" onClick={()=>onCalculatorPress('5')}>5</button>
                                                        <button className="input-buttons number-char" onClick={()=>onCalculatorPress('6')}>6</button>
                                                        <button className="mode-button">+20</button>
                                                        <br/>
                                                        <button className="input-buttons number-char" onClick={()=>onCalculatorPress('7')}>7</button>
                                                        <button className="input-buttons number-char" onClick={()=>onCalculatorPress('8')}>8</button>
                                                        <button className="input-buttons number-char" onClick={()=>onCalculatorPress('9')}>9</button>
                                                        <button className="mode-button">+50</button>
                                                        <br/>
                                                        <button className="input-buttons number-char">+/-</button>
                                                        <button className="input-buttons number-char" onClick={()=>onCalculatorPress('0')}>0</button>
                                                        <button className="input-buttons number-char">.</button>
                                                        <button className="input-buttons number-char" onClick={()=>onBackSpace()}>
                                                        <FaBackspace
                                                            style={{
                                                                width: 24,
                                                                height: 21,
                                                            }}
                                                        />
                                                        </button>
                                                        <br/>
                                                    </div>
                                                </section>
                                                <div className="payment-buttons">
                                                    <div className="customer-button">
                                                        <div className="button">
                                                        <FaUser/>
                                                        <span>{props.customer.first_name || 'Customer'}</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
};
const mapStateToProps = (state) => {
    return {
        value: state.srch.token,
        total: state.srch.total,
        customer: state.srch.customer,
        productsData: state.srch.cartData
    };
}
const mapDispatchToProps = (dispatch) => ({
    // dispatching actions returned by action creators
    onOrderSuccess: (cash, change) => dispatch(orderSuccess(cash, change))
});

export default connect(mapStateToProps, mapDispatchToProps)(Pay);