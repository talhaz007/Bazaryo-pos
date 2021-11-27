import { Suspense } from 'react';
import { Route, Switch } from 'react-router-dom';
import routes from '../routes/routes'; // Route list
import Loader from "react-loader-spinner";  

const ProtectedRoutes = () => (
  <Switch>
    <Suspense
      fallback={<Loader
        type="Puff"
        color="#00BFFF"
        height={100}
        width={100}
        timeout={3000}
      />}
    >
      {routes.map(({ component: Component, path, exact }) => (
        <Route
          path={`/${path}`}
          key={path}
          exact={exact}
          component={Component}
        >
          {/* <Component /> */}
        </Route>
      ))}
    </Suspense>
  </Switch>
);

export default ProtectedRoutes;