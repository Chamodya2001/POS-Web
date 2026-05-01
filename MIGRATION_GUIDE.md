# API Service Migration Guide

## Summary of Changes

All API services have been consolidated into a single unified service located at:
**`src/services/appService.js`**

## What Changed?

### ✅ Deleted Files
- `src/pages/service/Product_Service.js` - Removed (functionality moved to appService.js)

### ✅ Updated Files
- `src/config/AppService.js` - Now re-exports from the unified appService.js for backward compatibility

### ✅ New Files
- `src/services/appService.js` - **NEW** unified API service with all 57 API functions
- `API_REFERENCE.md` - Complete documentation of all APIs

## Migration Path

### Option 1: Keep Using AppService (Backward Compatible) ✅ RECOMMENDED FOR NOW
Your existing code will continue to work without changes:

```javascript
import AppService from '../config/AppService';

// All existing code works as-is
AppService.getCustomers();
AppService.addProduct(data);
AppService.saveOrder(orderData);
```

### Option 2: Migrate to New API Service (Recommended for New Code)
For new code, use the unified API service:

```javascript
import { API } from '../services/appService';

// New unified naming
API.getAllCustomers();
API.addProduct(data);
API.saveOrder(orderData);
```

## Function Name Mapping

| Old AppService Name | New API Name | Description |
|---------------------|--------------|-------------|
| `loginCandidate(email, password)` | `candidateLogin({email, password})` | Login as super admin |
| `loginCasior(email, password)` | `casiorLogin({email, password})` | Login as admin |
| `getCandidates()` | `getAllCandidates()` | Get all candidates |
| `saveCandidate(data)` | `addCandidate(data)` | Create candidate |
| `getEmployees()` | `getAllEmployees()` | Get all employees |
| `getCustomers()` | `getAllCustomers()` | Get all customers |
| `getItems()` | `getAllProducts()` | Get all products |
| `updateItem(id, data)` | `updateProduct(id, data)` | Update product |
| `deleteItem(id)` | `deleteProduct(id)` | Delete product |
| `getStocks()` | `getAllStocks()` | Get all stocks |
| `saveStock(data)` | `addStock(data)` | Create stock |
| `getCategories()` | `getAllCategories()` | Get all categories |
| `saveCategory(data)` | `addCategory(data)` | Create category |
| `getSuppliers()` | `getAllSuppliers()` | Get all suppliers |
| `saveSupplier(data)` | `addSupplier(data)` | Create supplier |
| `getOrders()` | `getAllOrders()` | Get all orders |
| `saveOrder(data)` | `saveOrder(data)` | ✅ Same name |

## New APIs Available (Not in Old AppService)

The new unified API service includes these additional functions:

### Loans (NEW) ✨
```javascript
API.addLoan(data)
API.getAllLoans()
API.getLoanById(id)
API.updateLoan(id, data)
API.deleteLoan(id)
```

### Additional CRUD Operations
```javascript
// Candidates
API.getCandidateById(id)
API.updateCandidate(id, data)

// Employees
API.getEmployeeById(id)

// Customers
API.updateCustomer(id, data)

// Categories
API.getCategoryById(id)
API.updateCategory(id, data)

// Stocks
API.getStockById(id)

// Suppliers
API.getSupplierById(id)

// Products
API.getProductById(id)
```

## Recommended Migration Strategy

### Phase 1: Current State (No Changes Needed) ✅
- All existing code continues to work
- `AppService` re-exports from the new unified service
- No breaking changes

### Phase 2: Gradual Migration (Optional)
When writing new components or updating existing ones:

1. Import from the new service:
   ```javascript
   import { API } from '../services/appService';
   ```

2. Use the new function names:
   ```javascript
   // Old
   const customers = await AppService.getCustomers();
   
   // New
   const customers = await API.getAllCustomers();
   ```

### Phase 3: Full Migration (Future)
Eventually, you can:
1. Update all imports to use the new API service
2. Remove the backward-compatible `AppService.js` wrapper
3. Use consistent naming across the entire codebase

## Benefits of the New Unified Service

1. **Single Source of Truth**: All APIs in one place
2. **Consistent Naming**: `add`, `getAll`, `getById`, `update`, `delete` pattern
3. **Complete Coverage**: All 57 backend APIs are now available
4. **Better Organization**: Grouped by resource type
5. **Easier Maintenance**: One file to update instead of multiple service files
6. **Type Safety Ready**: Easier to add TypeScript definitions later

## Example: Before and After

### Before (Old AppService)
```javascript
import AppService from '../config/AppService';

const handleSubmit = async () => {
  const customers = await AppService.getCustomers();
  const products = await AppService.getItems();
  const order = await AppService.saveOrder(orderData);
};
```

### After (New API Service)
```javascript
import { API } from '../services/appService';

const handleSubmit = async () => {
  const customers = await API.getAllCustomers();
  const products = await API.getAllProducts();
  const order = await API.saveOrder(orderData);
  
  // Now you can also use new APIs like loans
  const loans = await API.getAllLoans();
};
```

## Need Help?

- Check `API_REFERENCE.md` for complete API documentation
- All function signatures and examples are documented
- Both old and new naming conventions work during the transition period

---

**Last Updated:** 2026-02-13
**Migration Status:** Phase 1 Complete (Backward Compatible)
