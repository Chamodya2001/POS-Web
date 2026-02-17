# POS System - Complete API Reference

This document lists all available API endpoints in your POS system and how to use them with the unified `appService.js`.

## Import Statement

```javascript
import { API } from '../services/appService';
```

## Available APIs

### 1. Authentication APIs
- `API.candidateLogin(credentials)` - Login as super admin (candidate)
- `API.casiorLogin(credentials)` - Login as admin (casior/employee)

**Example:**
```javascript
const credentials = { email: "admin@example.com", password: "password123" };
const result = await API.candidateLogin(credentials);
```

---

### 2. Candidate APIs (Super Admin)
- `API.addCandidate(data)` - Create new candidate
- `API.getAllCandidates()` - Get all candidates
- `API.getCandidateById(id)` - Get candidate by ID
- `API.updateCandidate(id, data)` - Update candidate
- `API.deleteCandidate(id)` - Delete candidate
- `API.getCandidateFullData(candidateId)` - Get complete candidate data

**Backend Routes:**
- POST `/api/candidates/save`
- GET `/api/candidates/get`
- GET `/api/candidates/get-by-id/:id`
- PUT `/api/candidates/update-by-id/:id`
- DELETE `/api/candidates/delete-by-id/:id`
- POST `/api/candidates/login`
- GET `/api/candidate-full/full-data/:candidateId`

---

### 3. Employee APIs (Casior/Admin)
- `API.addEmployee(data)` - Create new employee
- `API.getAllEmployees()` - Get all employees
- `API.getEmployeeById(id)` - Get employee by ID
- `API.updateEmployee(id, data)` - Update employee
- `API.deleteEmployee(id)` - Delete employee

**Backend Routes:**
- POST `/api/casior/save`
- GET `/api/casior/get`
- GET `/api/casior/:id`
- PUT `/api/casior/:id`
- DELETE `/api/casior/:id`
- POST `/api/casior/login`

---

### 4. Customer APIs
- `API.addCustomer(data)` - Create new customer
- `API.getAllCustomers()` - Get all customers
- `API.getCustomerById(id)` - Get customer by ID
- `API.updateCustomer(id, data)` - Update customer
- `API.deleteCustomer(id)` - Delete customer

**Backend Routes:**
- POST `/api/customer/save`
- GET `/api/customer/get-all`
- GET `/api/customer/:id`
- PUT `/api/customer/:id`
- DELETE `/api/customer/:id`

**Example:**
```javascript
const customerData = {
  candidate_id: 1,
  first_name: "John",
  last_name: "Doe",
  email: "john@example.com",
  phone_number: "1234567890",
  nic: "123456789V",
  address: "123 Main St",
  status_id: 1,
  loan_balance: 0
};
const result = await API.addCustomer(customerData);
```

---

### 5. Supplier APIs
- `API.addSupplier(data)` - Create new supplier
- `API.getAllSuppliers()` - Get all suppliers
- `API.getSupplierById(id)` - Get supplier by ID
- `API.updateSupplier(id, data)` - Update supplier
- `API.deleteSupplier(id)` - Delete supplier

**Backend Routes:**
- POST `/api/suplier/save`
- GET `/api/suplier/get`
- GET `/api/suplier/:id`
- PUT `/api/suplier/:id`
- DELETE `/api/suplier/:id`

---

### 6. Product/Item APIs
- `API.addProduct(data)` - Create new product
- `API.getAllProducts()` - Get all products
- `API.getProductById(id)` - Get product by ID
- `API.updateProduct(id, data)` - Update product
- `API.deleteProduct(id)` - Delete product
- `API.uploadItemImage(file)` - Upload product image

**Backend Routes:**
- POST `/api/item/save`
- GET `/api/item/get`
- GET `/api/item/:id`
- PUT `/api/item/:id`
- DELETE `/api/item/:id`
- POST `/api/item/upload-image`
- GET `/api/item/images/:filename`

**Example:**
```javascript
// Add product
const productData = {
  candidate_id: 1,
  category_id: 1,
  item_name: "Laptop",
  bar_code: "123456789",
  item_code: "ITEM001",
  buying_price: 50000,
  selling_price: 75000,
  qty: 10,
  status_id: 1
};
const result = await API.addProduct(productData);

// Upload image
const formData = new FormData();
formData.append('image', fileInput.files[0]);
const imageCode = await API.uploadItemImage(formData);
```

---

### 7. Category APIs
- `API.addCategory(data)` - Create new category
- `API.getAllCategories()` - Get all categories
- `API.getCategoryById(id)` - Get category by ID
- `API.updateCategory(id, data)` - Update category
- `API.deleteCategory(id)` - Delete category

**Backend Routes:**
- POST `/api/category/save`
- GET `/api/category/get`
- GET `/api/category/:id`
- PUT `/api/category/:id`
- DELETE `/api/category/:id`

---

### 8. Order APIs
- `API.saveOrder(data)` - Create new order (order-process)
- `API.getAllOrders()` - Get all orders
- `API.getOrderById(id)` - Get order by ID
- `API.updateOrder(id, data)` - Update order
- `API.deleteOrder(id)` - Delete order

**Backend Routes:**
- POST `/api/order-process/add`
- GET `/api/order-process/getAll`
- GET `/api/order-process/get/:id`
- PUT `/api/order-process/update/:id`
- DELETE `/api/order-process/delete/:id`

**Example:**
```javascript
const orderData = {
  candidate_id: 1,
  casior_id: 1,
  customer_id: 5,
  payment_method: "cash",
  total_amount: 1500.00,
  status_id: 1
};
const result = await API.saveOrder(orderData);
```

---

### 9. Stock APIs
- `API.addStock(data)` - Create new stock entry
- `API.getAllStocks()` - Get all stock entries
- `API.getStockById(id)` - Get stock by ID
- `API.updateStock(id, data)` - Update stock
- `API.deleteStock(id)` - Delete stock

**Backend Routes:**
- POST `/api/stock/save`
- GET `/api/stock/get`
- GET `/api/stock/:id`
- PUT `/api/stock/:id`
- DELETE `/api/stock/:id`

---

### 10. Loan APIs ✨ NEW
- `API.addLoan(data)` - Create new loan
- `API.getAllLoans()` - Get all loans
- `API.getLoanById(id)` - Get loan by ID
- `API.updateLoan(id, data)` - Update loan
- `API.deleteLoan(id)` - Delete loan

**Backend Routes:**
- POST `/api/loan/save`
- GET `/api/loan/get`
- GET `/api/loan/:id`
- PUT `/api/loan/:id`
- DELETE `/api/loan/:id`

**Example:**
```javascript
const loanData = {
  candidate_id: 1,
  customer_id: 5,
  loan_balance: 5000.00,
  status_id: 1
};
const result = await API.addLoan(loanData);
```

---

## Complete API Count

**Total: 57 API Functions**

- Auth: 2
- Candidates: 6
- Employees: 5
- Customers: 5
- Suppliers: 5
- Products: 6
- Categories: 5
- Orders: 5
- Stocks: 5
- Loans: 5 ✨
- Candidate Full Data: 1

---

## Usage Examples

### Example 1: Complete Product Creation Flow
```javascript
import { API } from '../services/appService';

async function createProductWithImage() {
  try {
    // 1. Upload image first
    const formData = new FormData();
    formData.append('image', imageFile);
    const imageCode = await API.uploadItemImage(formData);
    
    // 2. Create product with image
    const productData = {
      candidate_id: 1,
      category_id: 2,
      item_name: "Gaming Mouse",
      bar_code: "GM123456",
      item_code: "ITEM-GM-001",
      buying_price: 2000,
      selling_price: 3500,
      qty: 50,
      image_code: imageCode,
      status_id: 1
    };
    
    const result = await API.addProduct(productData);
    console.log("Product created:", result);
  } catch (error) {
    console.error("Error:", error);
  }
}
```

### Example 2: Customer with Loan
```javascript
async function createCustomerWithLoan() {
  try {
    // 1. Create customer
    const customerData = {
      candidate_id: 1,
      first_name: "Jane",
      last_name: "Smith",
      email: "jane@example.com",
      phone_number: "0771234567",
      nic: "987654321V",
      address: "456 Oak Street",
      status_id: 1,
      loan_balance: 10000
    };
    
    const customer = await API.addCustomer(customerData);
    
    // 2. Loan is automatically created if loan_balance > 0
    // Or manually create additional loan
    const loanData = {
      candidate_id: 1,
      customer_id: customer.data.customer_id,
      loan_balance: 5000,
      status_id: 1
    };
    
    const loan = await API.addLoan(loanData);
    console.log("Customer and loan created:", { customer, loan });
  } catch (error) {
    console.error("Error:", error);
  }
}
```

### Example 3: Complete Order Processing
```javascript
async function processOrder() {
  try {
    // 1. Get all products
    const products = await API.getAllProducts();
    
    // 2. Get customer
    const customer = await API.getCustomerById(5);
    
    // 3. Create order
    const orderData = {
      candidate_id: 1,
      casior_id: 2,
      customer_id: customer.data.customer_id,
      payment_method: "card",
      total_amount: 15000,
      status_id: 1
    };
    
    const order = await API.saveOrder(orderData);
    console.log("Order created:", order);
  } catch (error) {
    console.error("Error:", error);
  }
}
```

---

## Error Handling

All API functions use the `APIHandler.handleResponse()` method which:
- Checks if the response is JSON
- Returns parsed data for successful requests
- Throws errors for failed requests

**Recommended error handling pattern:**
```javascript
try {
  const result = await API.addCustomer(data);
  if (result.success) {
    console.log("Success:", result.message);
    console.log("Data:", result.data);
  }
} catch (error) {
  console.error("API Error:", error.message || error);
}
```

---

## Notes

1. All APIs require proper authentication headers (handled automatically by `APIHandler.getHeader()`)
2. The `config.pos_api_url` should be set in your `config.js` file
3. All POST/PUT requests automatically set `Content-Type: application/json`
4. Image uploads use `FormData` and don't set Content-Type (browser handles it)
5. Supplier routes use `/api/suplier` (note the spelling in the backend)

---

**Last Updated:** 2026-02-13
**Version:** 1.0.0
