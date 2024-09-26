export const BASE_URL = process.env.REACT_APP_API_BASE_URL;


// export const LOGIN = '${BASE_URL}/auth/login';
export const LOGIN = `${BASE_URL}/auth/login`;

export const CREATEORUPDATE_CUSTOMERS_API = `${BASE_URL}/customers/createOrUpdateCustomer`;
export const CREATEORUPDATE_CUSTOMERS_ADDRESS_API = `${BASE_URL}/customers/createOrUpdateAddress`;
export const GETALLCUSTOMERS_API = `${BASE_URL}/customers/getAllCustomers`;
export const GETALLCUSTOMERSBYID_API = `${BASE_URL}/customers/getCustomerById`;
export const DELETECUSTOMERSBYID_API = `${BASE_URL}/customers/deleteCustomer`;
export const ORDERBYCUSTOMERID_API = `${BASE_URL}/customers/customers/getOrderByCustomerId`;

export const CREATEORUPDATE_USERS_API = `${BASE_URL}/users/createOrUpdateuser`;
export const GETALLUSERS_API = `${BASE_URL}/users/getAllUsers`;
export const GETALLUSERSBYID_API = `${BASE_URL}/users/getUserById`;
export const DELETEUSERSBYID_API = `${BASE_URL}/users/deleteUser`;

export const CREATEORUPDATE_STORES_API = `${BASE_URL}/stores/createOrUpdatestore`;
export const GETALLSTORES_API = `${BASE_URL}/stores/getAllStores`;
export const GETALLSTORESBYID_API = `${BASE_URL}/stores/getstoreById`;
export const DELETESTORESSBYID_API = `${BASE_URL}/stores/deletestore`;
export const STOREUSERSBYSTORE_ID_API = `${BASE_URL}/mapstoreusers/mapstoreuser`;
export const GETALLSTOREUSERSBYSTORE_ID_API = `${BASE_URL}/mapstoreusers/getallmapstoreuser`;

export const CREATEORUPDATE_ROLES_API = `${BASE_URL}/userrole/createOrUpdateRole`;
export const GETALLROLESS_API = `${BASE_URL}/userrole/getAllRoles`;
export const GETALLROLESBYID_API = `${BASE_URL}/userrole/getRoleById`;
export const DELETEROLESBYID_API = `${BASE_URL}/userrole/deleteRole`;

export const DELETE_CUSTOMERS_ADDRESS_API = `${BASE_URL}/customers/deleteAddress`;

export const CREATE_ORDERS = `${BASE_URL}/orders/createOrder`;
export const UPDATE_ORDERS = `${BASE_URL}/orders/updateOrder`;

export const GET_ALL_ORDERS = `${BASE_URL}/orders/getAllOrders`;
export const SEARCH_CUSTOMERS = `${BASE_URL}/customers/getCustomerById`;

export const GETPAYMENTSBYID_API = `${BASE_URL}/payments/getPaymentById`;
export const GET_ALL_PAYMENTS_API = `${BASE_URL}/payments/payments`;

export const GET_PAYMENTSBY_ORDERID_API = `${BASE_URL}/payments/payment`;


export const CITIES_API = `${BASE_URL}/cities/getCitiesByState?$filter=StateID eq`;
export const STATES_API = `${BASE_URL}/cities/getStatesByCountry?$filter=CountryID eq`;
export const COUNTRIES_API = `${BASE_URL}/cities/getCountries`;
export const GETORDERBYID_API = `${BASE_URL}/orders/getOrderById`;
export const CREATEORUPDATE_PAYMENT_API=`${BASE_URL}/payments/payments/createOrUpdatePayment`;
export const CREATEORUPDATE_ORDER_HISTORY__API=`${BASE_URL}/orderhistory/order-histories/createorderhistory`;
export const ORDER_STATUS_API=`${BASE_URL}/Orderstatus/getAllOrderStatus`;
export const GET_ALL_HYSTORYID_API=`${BASE_URL}/api/orderhistory/orderhistory`;