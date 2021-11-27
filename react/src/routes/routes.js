import { lazy } from 'react';

const routes = [
  {
    path: 'pos',
    component: lazy(() => import('../components/posPage/PosPage')),
    exact: true
  },
  {
    path: 'customer',
    component: lazy(() => import('../components/Customer/Customer')),
    exact: true
  },
  {
    path: 'addproduct',
    component: lazy(() => import('../components/AddProduct/AddProduct')),
    exact: true
  },
  {
    path: 'addcustomer',
    component: lazy(() => import('../components/AddCustomer/AddCustomer')),
    exact: true
  },
  {
    path: 'editproduct',
    component: lazy(() => import('../components/EditProduct/EditProduct')),
    exact: true
  },
  {
    path: 'editcustomer/:id',
    component: lazy(() => import('../components/EditCustomer/EditCustomer')),
    exact: true
  },
  {
    path: 'orders',
    component: lazy(() => import('../components/Orders/Orders')),
    exact: true
  },
  {
    path: 'reset',
    component: lazy(() => import('../components/Login/ResetPas')),
    exact: true
  },
  {
    path: 'edituser',
    component: lazy(() => import('../components/EditUser/EditUser')),
    exact: true
  },
  {
    path: 'payment',
    component: lazy(() => import('../components/Payment/Payment')),
    exact: true
  },
];

export default routes;