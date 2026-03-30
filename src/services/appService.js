import config from "../helper/config";
import APIHandler from "../handlers/APIHandler";

const API_BASE_URL = config.pos_api_url;

const API_ROUTES = {
    AUTH: {
        CANDIDATE_LOGIN: `${API_BASE_URL}/api/candidates/login`,
        CASIOR_LOGIN: `${API_BASE_URL}/api/casior/login`,
    },
    CANDIDATES: {
        SAVE: `${API_BASE_URL}/api/candidates/save`,
        GET: `${API_BASE_URL}/api/candidates/get`,
        GET_BY_ID: (id) => `${API_BASE_URL}/api/candidates/get-by-id/${id}`,
        UPDATE: (id) => `${API_BASE_URL}/api/candidates/update-by-id/${id}`,
        DELETE: (id) => `${API_BASE_URL}/api/candidates/delete-by-id/${id}`,
    },
    EMPLOYEES: {
        SAVE: `${API_BASE_URL}/api/casior/save`,
        GET: (candidateId) => `${API_BASE_URL}/api/casior/get/${candidateId}`,
        GET_BY_ID: (id) => `${API_BASE_URL}/api/casior/${id}`,
        UPDATE: (id) => `${API_BASE_URL}/api/casior/${id}`,
        DELETE: (id) => `${API_BASE_URL}/api/casior/${id}`,
      
    },
    CUSTOMERS: {
        SAVE: `${API_BASE_URL}/api/customer/save`,
        GET: (candidateId) => `${API_BASE_URL}/api/customer/get-all/${candidateId}`, // Note: "get-all" route
        GET_BY_ID: (id) => `${API_BASE_URL}/api/customer/${id}`,
        UPDATE: (id) => `${API_BASE_URL}/api/customer/update/${id}`,
        DELETE: (id) => `${API_BASE_URL}/api/customer/${id}`,
        SENDCUSTOMERMESSAGE:  `${API_BASE_URL}/api/customer/send-customer-email`,

    },
    SUPPLIERS: {
        SAVE: `${API_BASE_URL}/api/suplier/save`, // Note: "suplier" spelling
        GET: (candidateID) => `${API_BASE_URL}/api/suplier/get/${candidateID}`,
        GET_BY_ID: (id) => `${API_BASE_URL}/api/suplier/${id}`,
        UPDATE: (id) => `${API_BASE_URL}/api/suplier/${id}`,
        DELETE: (id) => `${API_BASE_URL}/api/suplier/${id}`,
    },
    ITEMS: {
        SAVE: `${API_BASE_URL}/api/item/save`,
        GET: (candidateId) => `${API_BASE_URL}/api/item/get/all/${candidateId}`,
        GET_BY_ID: (id) => `${API_BASE_URL}/api/item/${id}`,
        UPDATE: (id) => `${API_BASE_URL}/api/item/update/${id}`,
        DELETE: (id) => `${API_BASE_URL}/api/item/${id}/delete`,
        UPLOAD_IMAGE: `${API_BASE_URL}/api/item/upload-image`,
    },
    CATEGORIES: {
        SAVE: `${API_BASE_URL}/api/category/save`,
        GET: `${API_BASE_URL}/api/category/get`,
        GET_BY_ID: (id) => `${API_BASE_URL}/api/category/${id}`,
        UPDATE: (id) => `${API_BASE_URL}/api/category/${id}`,
        DELETE: (id) => `${API_BASE_URL}/api/category/${id}`,
    },
    ORDERS: {
        SAVE: `${API_BASE_URL}/api/order-process/add`,
        GET_ALL: (candidateID) => `${API_BASE_URL}/api/order-process/getAll/${candidateID}`,
        GET_BY_ID: (id) => `${API_BASE_URL}/api/order-process/get/${id}`,
        UPDATE: (id) => `${API_BASE_URL}/api/order-process/update/${id}`,
        DELETE: (id) => `${API_BASE_URL}/api/order-process/delete/${id}`,
        GET_EMPLOYEE_REPORT: (id) => `${API_BASE_URL}/api/order-process/report/employee/${id}`,
    },
    STOCKS: {
        SAVE: `${API_BASE_URL}/api/stock/save`,
        GET: `${API_BASE_URL}/api/stock/get`,
        GET_BY_ID: (id) => `${API_BASE_URL}/api/stock/${id}`,
        UPDATE: (id) => `${API_BASE_URL}/api/stock/${id}`,
        DELETE: (id) => `${API_BASE_URL}/api/stock/${id}`,
    },
    LOANS: {
        SAVE: `${API_BASE_URL}/api/loan/save`,
        GET: `${API_BASE_URL}/api/loan/get`,
        GET_BY_ID: (id) => `${API_BASE_URL}/api/loan/${id}`,
        UPDATE: (id) => `${API_BASE_URL}/api/loan/${id}`,
        DELETE: (id) => `${API_BASE_URL}/api/loan/${id}`,
    },
    CANDIDATE_FULL: {
        FULL_DATA: (candidateId) => `${API_BASE_URL}/api/candidate-full/full-data/${candidateId}`,
    },
    STATIC: {
        PRODUCT_IMAGE: (code) => `${API_BASE_URL}/static/images/products/${code}`,
        CATEGORY_IMAGE: (code) => `${API_BASE_URL}/static/images/categories/${code}`,
    },
};

// ==================== AUTH FUNCTIONS ====================

async function candidateLogin(credentials) {
    const requestOptions = {
        method: "POST",
        headers: APIHandler.getHeader(config.azure_ad_config.apis.POS.name),
        body: JSON.stringify(credentials),
    };
    const response = await fetch(API_ROUTES.AUTH.CANDIDATE_LOGIN, requestOptions);
    return APIHandler.handleResponse(response);
}

async function casiorLogin(credentials) {
    const requestOptions = {
        method: "POST",
        headers: APIHandler.getHeader(config.azure_ad_config.apis.POS.name),
        body: JSON.stringify(credentials),
    };
    const response = await fetch(API_ROUTES.AUTH.CASIOR_LOGIN, requestOptions);
    return APIHandler.handleResponse(response);
}

// ==================== CANDIDATE FUNCTIONS ====================

async function addCandidate(data) {
    const requestOptions = {
        method: "POST",
        headers: APIHandler.getHeader(config.azure_ad_config.apis.POS.name),
        body: JSON.stringify(data),
    };
    const response = await fetch(API_ROUTES.CANDIDATES.SAVE, requestOptions);
    return APIHandler.handleResponse(response);
}

async function getAllCandidates() {
    const requestOptions = {
        method: "GET",
        headers: APIHandler.getHeader(config.azure_ad_config.apis.POS.name),
    };
    const response = await fetch(API_ROUTES.CANDIDATES.GET, requestOptions);
    return APIHandler.handleResponse(response);
}

async function getCandidateById(id) {
    const requestOptions = {
        method: "GET",
        headers: APIHandler.getHeader(config.azure_ad_config.apis.POS.name),
    };
    const response = await fetch(API_ROUTES.CANDIDATES.GET_BY_ID(id), requestOptions);
    return APIHandler.handleResponse(response);
}

async function updateCandidate(id, data) {
    const requestOptions = {
        method: "PUT",
        headers: APIHandler.getHeader(config.azure_ad_config.apis.POS.name),
        body: JSON.stringify(data),
    };
    const response = await fetch(API_ROUTES.CANDIDATES.UPDATE(id), requestOptions);
    return APIHandler.handleResponse(response);
}

async function deleteCandidate(id) {
    const requestOptions = {
        method: "DELETE",
        headers: APIHandler.getHeader(config.azure_ad_config.apis.POS.name),
    };
    const response = await fetch(API_ROUTES.CANDIDATES.DELETE(id), requestOptions);
    return APIHandler.handleResponse(response);
}

// ==================== EMPLOYEE (CASIOR) FUNCTIONS ====================

async function addEmployee(data) {
    const requestOptions = {
        method: "POST",
        headers: APIHandler.getHeader(config.azure_ad_config.apis.POS.name),
        body: JSON.stringify(data),
    };
    const response = await fetch(API_ROUTES.EMPLOYEES.SAVE, requestOptions);
    return APIHandler.handleResponse(response);
}

async function getAllEmployees(candidateID) {
    const requestOptions = {
        method: "GET",
        headers: APIHandler.getHeader(config.azure_ad_config.apis.POS.name),
    };
    const response = await fetch(API_ROUTES.EMPLOYEES.GET(candidateID), requestOptions);
    return APIHandler.handleResponse(response);
}

async function getEmployeeById(id) {
    const requestOptions = {
        method: "GET",
        headers: APIHandler.getHeader(config.azure_ad_config.apis.POS.name),
    };
    const response = await fetch(API_ROUTES.EMPLOYEES.GET_BY_ID(id), requestOptions);
    return APIHandler.handleResponse(response);
}

async function updateEmployee(id, data) {
    const requestOptions = {
        method: "PUT",
        headers: APIHandler.getHeader(config.azure_ad_config.apis.POS.name),
        body: JSON.stringify(data),
    };
    const response = await fetch(API_ROUTES.EMPLOYEES.UPDATE(id), requestOptions);
    return APIHandler.handleResponse(response);
}

async function deleteEmployee(id) {
    const requestOptions = {
        method: "DELETE",
        headers: APIHandler.getHeader(config.azure_ad_config.apis.POS.name),
    };
    const response = await fetch(API_ROUTES.EMPLOYEES.DELETE(id), requestOptions);
    return APIHandler.handleResponse(response);
}

// ==================== CUSTOMER FUNCTIONS ====================

async function addCustomer(data) {
    const requestOptions = {
        method: "POST",
        headers: APIHandler.getHeader(config.azure_ad_config.apis.POS.name),
        body: JSON.stringify(data),
    };
    const response = await fetch(API_ROUTES.CUSTOMERS.SAVE, requestOptions);
    return APIHandler.handleResponse(response);
}

async function getAllCustomers(id) {
    const requestOptions = {
        method: "GET",
        headers: APIHandler.getHeader(config.azure_ad_config.apis.POS.name),
    };
    const response = await fetch(API_ROUTES.CUSTOMERS.GET(id), requestOptions);
    return APIHandler.handleResponse(response);
}

async function getCustomerById(id) {
    const requestOptions = {
        method: "GET",
        headers: APIHandler.getHeader(config.azure_ad_config.apis.POS.name),
    };
    const response = await fetch(API_ROUTES.CUSTOMERS.GET_BY_ID(id), requestOptions);
    return APIHandler.handleResponse(response);
}

async function updateCustomer(id, data) {
    const requestOptions = {
        method: "PUT",
        headers: APIHandler.getHeader(config.azure_ad_config.apis.POS.name),
        body: JSON.stringify(data),
    };
    const response = await fetch(API_ROUTES.CUSTOMERS.UPDATE(id), requestOptions);
    return APIHandler.handleResponse(response);
}

async function deleteCustomer(id) {
    const requestOptions = {
        method: "DELETE",
        headers: APIHandler.getHeader(config.azure_ad_config.apis.POS.name),
    };
    const response = await fetch(API_ROUTES.CUSTOMERS.DELETE(id), requestOptions);
    return APIHandler.handleResponse(response);
}

async function sendCustomerMessage(
    senderEmail,
    receiverEmail,
    customerName,
    customerLoan,
    shopName,
    senderPhone,
    email
) {
    const requestOptions = {
        method: "POST",
        headers: APIHandler.getHeader(config.azure_ad_config.apis.POS.name),
        body: JSON.stringify({ senderEmail, receiverEmail, customerName, customerLoan, shopName, senderPhone, email }),
    };
    const response = await fetch(API_ROUTES.CUSTOMERS.SENDCUSTOMERMESSAGE, requestOptions);
    return APIHandler.handleResponse(response);
}

// ==================== SUPPLIER FUNCTIONS ====================

async function addSupplier(data) {
    const requestOptions = {
        method: "POST",
        headers: APIHandler.getHeader(config.azure_ad_config.apis.POS.name),
        body: JSON.stringify(data),
    };
    const response = await fetch(API_ROUTES.SUPPLIERS.SAVE, requestOptions);
    return APIHandler.handleResponse(response);
}

async function getAllSuppliers(candidate_id) {
    const requestOptions = {
        method: "GET",
        headers: APIHandler.getHeader(config.azure_ad_config.apis.POS.name),
    };
    const response = await fetch(API_ROUTES.SUPPLIERS.GET(candidate_id), requestOptions);
    return APIHandler.handleResponse(response);
}

async function getSupplierById(id) {
    const requestOptions = {
        method: "GET",
        headers: APIHandler.getHeader(config.azure_ad_config.apis.POS.name),
    };
    const response = await fetch(API_ROUTES.SUPPLIERS.GET_BY_ID(id), requestOptions);
    return APIHandler.handleResponse(response);
}

async function updateSupplier(id, data) {
    const requestOptions = {
        method: "PUT",
        headers: APIHandler.getHeader(config.azure_ad_config.apis.POS.name),
        body: JSON.stringify(data),
    };
    const response = await fetch(API_ROUTES.SUPPLIERS.UPDATE(id), requestOptions);
    return APIHandler.handleResponse(response);
}

async function deleteSupplier(id) {
    const requestOptions = {
        method: "DELETE",
        headers: APIHandler.getHeader(config.azure_ad_config.apis.POS.name),
    };
    const response = await fetch(API_ROUTES.SUPPLIERS.DELETE(id), requestOptions);
    return APIHandler.handleResponse(response);
}

// ==================== PRODUCT/ITEM FUNCTIONS ====================

async function addProduct(data) {
    const requestOptions = {
        method: "POST",
        headers: APIHandler.getHeader(config.azure_ad_config.apis.POS.name),
        body: JSON.stringify(data),
    };
    const response = await fetch(API_ROUTES.ITEMS.SAVE, requestOptions);
    return APIHandler.handleResponse(response);
}

async function getAllProducts(candidate_id) {
    const requestOptions = {
        method: "GET",
        headers: APIHandler.getHeader(config.azure_ad_config.apis.POS.name),
    };
    const response = await fetch(API_ROUTES.ITEMS.GET(candidate_id), requestOptions);
    return APIHandler.handleResponse(response);
}

async function getProductById(id) {
    const requestOptions = {
        method: "GET",
        headers: APIHandler.getHeader(config.azure_ad_config.apis.POS.name),
    };
    const response = await fetch(API_ROUTES.ITEMS.GET_BY_ID(id), requestOptions);
    return APIHandler.handleResponse(response);
}

async function updateProduct(id, data) {
    const requestOptions = {
        method: "PUT",
        headers: APIHandler.getHeader(config.azure_ad_config.apis.POS.name),
        body: JSON.stringify(data),
    };
    const response = await fetch(API_ROUTES.ITEMS.UPDATE(id), requestOptions);
    return APIHandler.handleResponse(response);
}

async function deleteProduct(id) {
    const requestOptions = {
        method: "DELETE",
        headers: APIHandler.getHeader(config.azure_ad_config.apis.POS.name),
    };
    const response = await fetch(API_ROUTES.ITEMS.DELETE(id), requestOptions);
    return APIHandler.handleResponse(response);
}

async function uploadItemImage(file) {
    try {
        const response = await fetch(API_ROUTES.ITEMS.UPLOAD_IMAGE, {
            method: "POST",
            body: file,
        });
        if (!response.ok) {
            throw new Error(`Upload failed with status ${response.status}`);
        }
        const data = await response.json();
        return data.data.image_code;
    } catch (err) {
        console.error("Image upload failed:", err);
        throw err;
    }
}

// ==================== CATEGORY FUNCTIONS ====================

async function addCategory(data) {
    const requestOptions = {
        method: "POST",
        headers: APIHandler.getHeader(config.azure_ad_config.apis.POS.name),
        body: JSON.stringify(data),
    };
    const response = await fetch(API_ROUTES.CATEGORIES.SAVE, requestOptions);
    return APIHandler.handleResponse(response);
}

async function getAllCategories() {
    const requestOptions = {
        method: "GET",
        headers: APIHandler.getHeader(config.azure_ad_config.apis.POS.name),
    };
    const response = await fetch(API_ROUTES.CATEGORIES.GET, requestOptions);
    return APIHandler.handleResponse(response);
}

async function getCategoryById(id) {
    const requestOptions = {
        method: "GET",
        headers: APIHandler.getHeader(config.azure_ad_config.apis.POS.name),
    };
    const response = await fetch(API_ROUTES.CATEGORIES.GET_BY_ID(id), requestOptions);
    return APIHandler.handleResponse(response);
}

async function updateCategory(id, data) {
    const requestOptions = {
        method: "PUT",
        headers: APIHandler.getHeader(config.azure_ad_config.apis.POS.name),
        body: JSON.stringify(data),
    };
    const response = await fetch(API_ROUTES.CATEGORIES.UPDATE(id), requestOptions);
    return APIHandler.handleResponse(response);
}

async function deleteCategory(id) {
    const requestOptions = {
        method: "DELETE",
        headers: APIHandler.getHeader(config.azure_ad_config.apis.POS.name),
    };
    const response = await fetch(API_ROUTES.CATEGORIES.DELETE(id), requestOptions);
    return APIHandler.handleResponse(response);
}

// ==================== ORDER FUNCTIONS ====================

async function saveOrder(data) {
    const requestOptions = {
        method: "POST",
        headers: APIHandler.getHeader(config.azure_ad_config.apis.POS.name),
        body: JSON.stringify(data),
    };
    const response = await fetch(API_ROUTES.ORDERS.SAVE, requestOptions);
    return APIHandler.handleResponse(response);
}

async function getAllOrders(candidate_id) {
    const requestOptions = {
        method: "GET",
        headers: APIHandler.getHeader(config.azure_ad_config.apis.POS.name),
    };
    const response = await fetch(API_ROUTES.ORDERS.GET_ALL(candidate_id), requestOptions);
    return APIHandler.handleResponse(response);
}

async function getOrderById(id) {
    const requestOptions = {
        method: "GET",
        headers: APIHandler.getHeader(config.azure_ad_config.apis.POS.name),
    };
    const response = await fetch(API_ROUTES.ORDERS.GET_BY_ID(id), requestOptions);
    return APIHandler.handleResponse(response);
}

async function updateOrder(id, data) {
    const requestOptions = {
        method: "PUT",
        headers: APIHandler.getHeader(config.azure_ad_config.apis.POS.name),
        body: JSON.stringify(data),
    };
    const response = await fetch(API_ROUTES.ORDERS.UPDATE(id), requestOptions);
    return APIHandler.handleResponse(response);
}

async function deleteOrder(id) {
    const requestOptions = {
        method: "DELETE",
        headers: APIHandler.getHeader(config.azure_ad_config.apis.POS.name),
    };
    const response = await fetch(API_ROUTES.ORDERS.DELETE(id), requestOptions);
    return APIHandler.handleResponse(response);
}

async function getEmployeeReport(id) {
    const requestOptions = {
        method: "GET",
        headers: APIHandler.getHeader(config.azure_ad_config.apis.POS.name),
    };
    const response = await fetch(API_ROUTES.ORDERS.GET_EMPLOYEE_REPORT(id), requestOptions);
    return APIHandler.handleResponse(response);
}

// ==================== STOCK FUNCTIONS ====================

async function addStock(data) {
    const requestOptions = {
        method: "POST",
        headers: APIHandler.getHeader(config.azure_ad_config.apis.POS.name),
        body: JSON.stringify(data),
    };
    const response = await fetch(API_ROUTES.STOCKS.SAVE, requestOptions);
    return APIHandler.handleResponse(response);
}

async function getAllStocks() {
    const requestOptions = {
        method: "GET",
        headers: APIHandler.getHeader(config.azure_ad_config.apis.POS.name),
    };
    const response = await fetch(API_ROUTES.STOCKS.GET, requestOptions);
    return APIHandler.handleResponse(response);
}

async function getStockById(id) {
    const requestOptions = {
        method: "GET",
        headers: APIHandler.getHeader(config.azure_ad_config.apis.POS.name),
    };
    const response = await fetch(API_ROUTES.STOCKS.GET_BY_ID(id), requestOptions);
    return APIHandler.handleResponse(response);
}

async function updateStock(id, data) {
    const requestOptions = {
        method: "PUT",
        headers: APIHandler.getHeader(config.azure_ad_config.apis.POS.name),
        body: JSON.stringify(data),
    };
    const response = await fetch(API_ROUTES.STOCKS.UPDATE(id), requestOptions);
    return APIHandler.handleResponse(response);
}

async function deleteStock(id) {
    const requestOptions = {
        method: "DELETE",
        headers: APIHandler.getHeader(config.azure_ad_config.apis.POS.name),
    };
    const response = await fetch(API_ROUTES.STOCKS.DELETE(id), requestOptions);
    return APIHandler.handleResponse(response);
}

// ==================== LOAN FUNCTIONS ====================

async function addLoan(data) {
    const requestOptions = {
        method: "POST",
        headers: APIHandler.getHeader(config.azure_ad_config.apis.POS.name),
        body: JSON.stringify(data),
    };
    const response = await fetch(API_ROUTES.LOANS.SAVE, requestOptions);
    return APIHandler.handleResponse(response);
}

async function getAllLoans() {
    const requestOptions = {
        method: "GET",
        headers: APIHandler.getHeader(config.azure_ad_config.apis.POS.name),
    };
    const response = await fetch(API_ROUTES.LOANS.GET, requestOptions);
    return APIHandler.handleResponse(response);
}

async function getLoanById(id) {
    const requestOptions = {
        method: "GET",
        headers: APIHandler.getHeader(config.azure_ad_config.apis.POS.name),
    };
    const response = await fetch(API_ROUTES.LOANS.GET_BY_ID(id), requestOptions);
    return APIHandler.handleResponse(response);
}

async function updateLoan(id, data) {
    const requestOptions = {
        method: "PUT",
        headers: APIHandler.getHeader(config.azure_ad_config.apis.POS.name),
        body: JSON.stringify(data),
    };
    const response = await fetch(API_ROUTES.LOANS.UPDATE(id), requestOptions);
    return APIHandler.handleResponse(response);
}

async function deleteLoan(id) {
    const requestOptions = {
        method: "DELETE",
        headers: APIHandler.getHeader(config.azure_ad_config.apis.POS.name),
    };
    const response = await fetch(API_ROUTES.LOANS.DELETE(id), requestOptions);
    return APIHandler.handleResponse(response);
}

// ==================== CANDIDATE FULL DATA FUNCTION ====================

async function getCandidateFullData(candidateId) {
    const requestOptions = {
        method: "GET",
        headers: APIHandler.getHeader(config.azure_ad_config.apis.POS.name),
    };
    const response = await fetch(API_ROUTES.CANDIDATE_FULL.FULL_DATA(candidateId), requestOptions);
    return APIHandler.handleResponse(response);
}

// ==================== SINGLE UNIFIED EXPORT ====================

export const API = {
    // Auth
    candidateLogin,
    casiorLogin,

    // Auth ALIASES
    loginCandidate: (email, password) => candidateLogin({ email, password }),
    loginCasior: (email, password) => casiorLogin({ email, password }),

    // Candidates
    addCandidate,
    getAllCandidates,
    getCandidateById,
    updateCandidate,
    deleteCandidate,

    // Candidates ALIASES
    getCandidates: getAllCandidates,
    saveCandidate: addCandidate,
    // getCandidateById - same
    // updateCandidate - same
    // deleteCandidate - same

    // Employees
    addEmployee,
    getAllEmployees,
    getEmployeeById,
    updateEmployee,
    deleteEmployee,

    // Employees ALIASES
    getEmployees: getAllEmployees,
    // addEmployee - same
    // updateEmployee - same
    // deleteEmployee - same

    // Customers
    addCustomer,
    getAllCustomers,
    getCustomerById,
    updateCustomer,
    deleteCustomer,
    sendCustomerMessage,

    // Customers ALIASES
    getCustomers: getAllCustomers,
    // addCustomer - same
    // getCustomerById - same
    // updateCustomer - same
    // deleteCustomer - same

    // Suppliers
    addSupplier,
    getAllSuppliers,
    getSupplierById,
    updateSupplier,
    deleteSupplier,

    // Suppliers ALIASES
    getSuppliers: getAllSuppliers,
    saveSupplier: addSupplier,
    // updateSupplier - same
    // deleteSupplier - same

    // Products
    addProduct,
    getAllProducts,
    getProductById,
    updateProduct,
    deleteProduct,
    uploadItemImage,

    // Products ALIASES
    getItems: getAllProducts,
    // addProduct - same
    updateItem: updateProduct,
    deleteItem: deleteProduct,
    // uploadItemImage - same
    getProductImageUrl: (code) => API_ROUTES.STATIC.PRODUCT_IMAGE(code),

    // Categories
    addCategory,
    getAllCategories,
    getCategoryById,
    updateCategory,
    deleteCategory,

    // Categories ALIASES
    getCategories: getAllCategories,
    saveCategory: addCategory,
    // deleteCategory - same
    getCategoryImageUrl: (code) => API_ROUTES.STATIC.CATEGORY_IMAGE(code),

    // Orders
    saveOrder,
    getAllOrders,
    getOrderById,
    updateOrder,
    deleteOrder,

    // Orders ALIASES
    getOrders: getAllOrders,
    // saveOrder - same
    // getOrderById - same
    // updateOrder - same
    // deleteOrder - same

    // Stocks
    addStock,
    getAllStocks,
    getStockById,
    updateStock,
    deleteStock,

    // Stocks ALIASES
    getStocks: getAllStocks,
    saveStock: addStock,
    // updateStock - same
    // deleteStock - same

    // Loans
    addLoan,
    getAllLoans,
    getLoanById,
    updateLoan,
    deleteLoan,

    // Loans ALIASES
    getLoans: getAllLoans,
    saveLoan: addLoan,
    // getLoanById - same
    // updateLoan - same
    // deleteLoan - same

    // Candidate Full Data
    getCandidateFullData,

    // Reports
    getEmployeeReport,
};

export default API;
