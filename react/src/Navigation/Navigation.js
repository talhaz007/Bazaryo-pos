import React, { useState, useEffect, lazy, Suspense } from "react";
import { useCookies } from "react-cookie";
import { Router, Switch, Redirect, Route } from "react-router-dom";
import { connect } from "react-redux";
import { tokenGenerator, internetStatus } from "../store/actions";
import Loader from "react-loader-spinner";
import PosPage from "../components/posPage/PosPage";
import Customer from "../components/Customer/Customer";
import AddCustomer from "../components/AddCustomer/AddCustomer";
import UiPackageExample from "../components/UIComponents/UiPackageExample";
import Orders from "../components/Orders/Orders";
import Header from "../components/Header/Header";
import AddProduct from "../components/AddProduct/AddProduct";
import Offline from '../components/Offline/Offline';
import SignUp from "../components/Login/SignUp";
import History from "./History";
import LogIn from "../components/Login/LogIn";
import ResetPas from "../components/Login/ResetPas";
import EditUser from "../components/EditUser/EditUser";
import Payment from "../components/Payment/Payment";
import EditCustomer from "../components/EditCustomer/EditCustomer";
import EditProduct from "../components/EditProduct/EditProduct";
import SalesDashboard from "../components/posPage/SalesDashboard";
import Pay from "../components/Pay/Pay";
import Menu from "../components/Menu/Menu";
import AllProducts from "../components/AllProducts/AllProducts";
// import PublicRoute from '../PublicRoutes/PublicRoutes';
// import PrivateRoute from '../PrivateRoutes/Privateroutes';
// import ProtectedRoutes from '../ProtectedRoutes/ProtectedRoutes';

// const LoginPage = lazy(() => import('../components/Login/LogIn'));
// const Register = lazy(() => import('../components/Login/SignUp'));

const Navigation = (props) => {
    const [mounted, setMounted] = useState(false);
    const [cookies, setCookie] = useCookies(["user"]);
    const [userId, setUserId] = useState(cookies.userId);
    const [userToken, setUserToken] = useState(cookies.userToken);
    const [offlineStatus, setOfflineStatus] = useState(false);
    let isAuthenticated = userId;

    // const fetchToken = async (requestOptions)=>{

    //       let res = await fetch("http://localhost:8765/apis/token", requestOptions);
    //      // console.log(res.json().to, 'responsedToken');
    //       let data =await res.json();
    //       console.log(data.token, 'responsedToken');
    //       props.onTokenGenerator(data.token);
    //         // .then((res) => res.json())
    //         // .then((data) => {
    //         //     console.log(data.token, "tokennnnnnnnnnnnnn");
    //         //     props.onTokenGenerator(data.token);
    //         // });
    //     }
    window.addEventListener('online', handleConnection);
    window.addEventListener('offline', handleConnection);

function handleConnection() {
  if (navigator.onLine) {
      console.log('handling internetttttt');
    isReachable(getServerUrl()).then(function(online) {
      if (online) {
        // handle online status
        console.log('online');
        setOfflineStatus(false);
        props.onCheckInternet(false);
      } else {
        console.log('no connectivity');
      }
    });
  } else {
    setTimeout(function(){ 
        console.log('offline');
        setOfflineStatus(true);
        props.onCheckInternet(true);
    }, 86400000);
    
  }
}

function isReachable(url) {
  /**
   * Note: fetch() still "succeeds" for 404s on subdirectories,
   * which is ok when only testing for domain reachability.
   *
   * Example:
   *   https://google.com/noexist does not throw
   *   https://noexist.com/noexist does throw
   */
  return fetch(url, { method: 'HEAD', mode: 'no-cors' })
    .then(function(resp) {
      return resp && (resp.ok || resp.type === 'opaque');
    })
    .catch(function(err) {
      console.warn('[conn test failure]:', err);
    });
}

function getServerUrl() {
  return window.location.origin;
}
    if (!mounted) {
        props.onTokenGenerator(userToken);
    }
    useEffect(() => {
        setMounted(true);
    }, []);
    const fetchUserIdCookies = () => {
        setUserId(cookies.userId);
        if (cookies.userToken !== userToken) {
            setUserToken(cookies.userToken);
            props.onTokenGenerator(userToken);
        }
    };
    useEffect(() => {
        fetchUserIdCookies();
    }, [fetchUserIdCookies]);
    console.log(userId, "userID");
    // useEffect(() => {
    //     isAuthenticated=cookies.userId;
    // }, [cookies.userId]);
    // console.log(userId, 'userID');
    // return (
    //     <Router>
    //       <Suspense fallback={<Loader
    //     type="Puff"
    //     color="#00BFFF"
    //     height={100}
    //     width={100}
    //     timeout={3000}
    //   />}>
    //         <Switch>
    //           <PublicRoute
    //             path="/login"
    //             isAuthenticated={isAuthenticated}
    //           >
    //             <LoginPage />
    //           </PublicRoute>
    //           <PublicRoute
    //             path="/register"
    //             isAuthenticated={isAuthenticated}
    //           >
    //             <Register />
    //           </PublicRoute>
    //           {/* <PublicRoute
    //             path="/forgot-password"
    //             isAuthenticated={isAuthenticated}
    //           >
    //             <ForgotPassword />
    //           </PublicRoute> */}
    //           <PrivateRoute
    //             path="/"
    //             isAuthenticated={isAuthenticated}
    //           >
    //               {/* <Header /> */}
    //             <ProtectedRoutes />
    //           </PrivateRoute>
    //           {/* <Route path="*">
    //             <NoFoundComponent />
    //           </Route> */}
    //         </Switch>
    //       </Suspense>
    //     </Router>
    // );
    if (!userId) {
        return (
            <Router history={History}>
                <div>
                    <Switch>
                        <Route path="/login" component={LogIn} />
                        <Route path="/signup" component={SignUp} />
                        <Redirect to="/login" />
                    </Switch>
                </div>
            </Router>
        );
    } else {
        return (
            <Router history={History}>
                <div>
                    <Switch>
                        <Route path="/" exact component={offlineStatus === true ? Offline : SalesDashboard} /> 
                        <Route path="/pospage" exact component={offlineStatus === true ? Offline :PosPage} />
                        <Route path="/customer" exact component={offlineStatus === true ? Offline :Customer} />
                        <Route
                            path="/addproduct"
                            exact
                            component={offlineStatus === true ? Offline :AddProduct}
                        />
                        <Route
                            path="/addcustomer"
                            exact
                            component={offlineStatus === true ? Offline :AddCustomer}
                        />
                        <Route
                            path="/editproduct/:id"
                            exact
                            component={offlineStatus === true ? Offline :EditProduct}
                        />
                        <Route
                            path="/editcustomer/:id"
                            exact
                            component={offlineStatus === true ? Offline :EditCustomer}
                        />
                        <Route
                            path="/allproducts"
                            exact
                            component={offlineStatus === true ? Offline :AllProducts}
                        />

                        <Route path="/orders" exact component={offlineStatus === true ? Offline :Orders} />
                        <Route
                            path="/uicomponents"
                            component={offlineStatus === true ? Offline :UiPackageExample}
                        />
                        {/* <Route path="/signup" component={SignUp} />
                    <Route path="/login" component={LogIn} /> */}
                        <Route path="/reset" component={offlineStatus === true ? Offline :ResetPas} />
                        <Route path="/edituser" component={offlineStatus === true ? Offline :EditUser} />
                        <Route path="/pay" component={offlineStatus === true ? Offline :Pay} />
                        <Route path="/payment" component={offlineStatus === true ? Offline : Payment} />
                        <Redirect to="/" />
                    </Switch>
                </div>
            </Router>
        );
    }
};

const mapDispatchToProps = (dispatch) => ({
    onTokenGenerator: (value) => dispatch(tokenGenerator(value)),
    onCheckInternet: (value) => dispatch(internetStatus(value))
});
export default connect(null, mapDispatchToProps)(Navigation);
