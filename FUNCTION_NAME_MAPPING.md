# API Function Name Mapping for Find & Replace

## Instructions
Use Find & Replace (Ctrl+H) in your code editor to update function calls.
Replace in the following order to avoid conflicts.

## Auth Functions
```
AppService.loginCandidate(email, password)
→ API.candidateLogin({ email, password })

AppService.loginCasior(email, password)
→ API.casiorLogin({ email, password })
```

## Candidate Functions
```
AppService.getCandidates()
→ API.getAllCandidates()

AppService.saveCandidate(
→ API.addCandidate(

AppService.getCandidateById(
→ API.getCandidateById(

AppService.updateCandidate(
→ API.updateCandidate(

AppService.deleteCandidate(
→ API.deleteCandidate(

AppService.getCandidateFullData(
→ API.getCandidateFullData(
```

## Employee Functions
```
AppService.getEmployees()
→ API.getAllEmployees()

AppService.addEmployee(
→ API.addEmployee(

AppService.updateEmployee(
→ API.updateEmployee(

AppService.deleteEmployee(
→ API.deleteEmployee(
```

## Customer Functions
```
AppService.getCustomers()
→ API.getAllCustomers()

AppService.addCustomer(
→ API.addCustomer(

AppService.getCustomerById(
→ API.getCustomerById(

AppService.deleteCustomer(
→ API.deleteCustomer(
```

## Product/Item Functions
```
AppService.getItems()
→ API.getAllProducts()

AppService.addProduct(
→ API.addProduct(

AppService.updateItem(
→ API.updateProduct(

AppService.deleteItem(
→ API.deleteProduct(

AppService.uploadItemImage(
→ API.uploadItemImage(

AppService.getProductImageUrl(
→ ((code) => `http://localhost:5005/static/images/products/${code}`)(
```

## Stock Functions
```
AppService.getStocks()
→ API.getAllStocks()

AppService.saveStock(
→ API.addStock(

AppService.updateStock(
→ API.updateStock(

AppService.deleteStock(
→ API.deleteStock(
```

## Category Functions
```
AppService.getCategories()
→ API.getAllCategories()

AppService.saveCategory(
→ API.addCategory(

AppService.deleteCategory(
→ API.deleteCategory(

AppService.getCategoryImageUrl(
→ ((code) => `http://localhost:5005/static/images/categories/${code}`)(
```

## Supplier Functions
```
AppService.getSuppliers()
→ API.getAllSuppliers()

AppService.saveSupplier(
→ API.addSupplier(

AppService.updateSupplier(
→ API.updateSupplier(

AppService.deleteSupplier(
→ API.deleteSupplier(
```

## Order Functions
```
AppService.saveOrder(
→ API.saveOrder(

AppService.getOrders()
→ API.getAllOrders()

AppService.getOrderById(
→ API.getOrderById(

AppService.updateOrder(
→ API.updateOrder(

AppService.deleteOrder(
→ API.deleteOrder(
```

## Quick Reference Table

| Old AppService | New API | Notes |
|----------------|---------|-------|
| `getCustomers()` | `getAllCustomers()` | Added "All" |
| `getItems()` | `getAllProducts()` | Items → Products |
| `updateItem()` | `updateProduct()` | Items → Products |
| `deleteItem()` | `deleteProduct()` | Items → Products |
| `saveStock()` | `addStock()` | save → add |
| `saveCategory()` | `addCategory()` | save → add |
| `saveSupplier()` | `addSupplier()` | save → add |
| `saveCandidate()` | `addCandidate()` | save → add |
| `getEmployees()` | `getAllEmployees()` | Added "All" |
| `getStocks()` | `getAllStocks()` | Added "All" |
| `getCategories()` | `getAllCategories()` | Added "All" |
| `getSuppliers()` | `getAllSuppliers()` | Added "All" |
| `getOrders()` | `getAllOrders()` | Added "All" |

## Files to Update (14 files)
1. src/pages/StockManagementPage.jsx
2. src/pages/StockHistoryPage.jsx
3. src/pages/OrdersPage.jsx
4. src/pages/EmployeeReportPage.jsx
5. src/pages/Dashboard.jsx
6. src/pages/CustomersPage.jsx
7. src/pages/CustomerProfilePage.jsx
8. src/pages/AddSupplierPage.jsx
9. src/pages/AddProductPage.jsx
10. src/pages/AddStockPage.jsx
11. src/pages/AddCustomerPage.jsx
12. src/pages/AddEmploymentPage.jsx
13. src/context/AuthContext.jsx
14. src/components/StockUpdateModal.jsx
