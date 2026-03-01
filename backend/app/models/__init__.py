from app.models.user import Company, User
from app.models.product import Category, Product
from app.models.warehouse import Warehouse
from app.models.inventory import Inventory, InventoryMovement
from app.models.supplier import Supplier, SupplierProduct
from app.models.sale import Sale, SaleItem
from app.models.activity import ActivityLog

# Central place to import all models to ensure they are registered with SQLAlchemy
__all__ = [
    'Company', 'User', 'Category', 'Product', 'Warehouse', 
    'Inventory', 'InventoryMovement', 'Supplier', 'SupplierProduct', 
    'Sale', 'SaleItem', 'ActivityLog'
]
