from app import create_app
from app.models.user import db, User, Company
from app.models.product import Category, Product
from app.models.warehouse import Warehouse
from app.models.inventory import Inventory
from app.models.supplier import Supplier
from werkzeug.security import generate_password_hash

app = create_app()

def seed_data():
    with app.app_context():
        # Clean current database
        db.drop_all()
        db.create_all()

        print("Database initialized...")
        
        # 1. Create a demo company
        company = Company(name="TechNexus Solutions")
        db.session.add(company)
        db.session.flush()

        # 2. Create users
        admin_pw = generate_password_hash("admin123", method="pbkdf2:sha256")
        admin = User(
            company_id=company.id,
            email="admin@technexus.com",
            password_hash=admin_pw,
            first_name="Jane",
            last_name="Doe",
            role="company_admin"
        )
        db.session.add(admin)

        # 3. Create Warehouses
        w1 = Warehouse(company_id=company.id, name="Central Distribution", location="New York, NY")
        w2 = Warehouse(company_id=company.id, name="West Coast Hub", location="Los Angeles, CA")
        db.session.add_all([w1, w2])
        db.session.flush()

        # 4. Create Categories
        cat_elec = Category(company_id=company.id, name="Electronics")
        cat_acc = Category(company_id=company.id, name="Accessories")
        db.session.add_all([cat_elec, cat_acc])
        db.session.flush()

        # 5. Create Suppliers
        supp1 = Supplier(company_id=company.id, name="Global Tech Dist", contact_name="John Smith", email="john@gtd.com", phone="555-0100", lead_time_days=5)
        supp2 = Supplier(company_id=company.id, name="Accessories Plus", contact_name="Mary Jones", email="mary@accplus.com", phone="555-0200", lead_time_days=3)
        db.session.add_all([supp1, supp2])
        db.session.flush()

        # 6. Create Products & Inventory
        products_data = [
            ("SKU-001", "MacBook Pro 16", cat_elec.id, 2499.00, 2000.00, 10, w1.id, 50),
            ("SKU-002", "iPhone 15 Pro", cat_elec.id, 999.00, 800.00, 20, w1.id, 100),
            ("SKU-003", "AirPods Pro 2", cat_acc.id, 249.00, 150.00, 30, w2.id, 5), # Low stock!
            ("SKU-004", "Magic Mouse", cat_acc.id, 99.00, 60.00, 15, w2.id, 12), # Low stock!
            ("SKU-005", "iPad Air", cat_elec.id, 599.00, 450.00, 15, w1.id, 40)
        ]

        for sku, name, cat_id, price, cost, min_stock, w_id, qty in products_data:
            p = Product(
                company_id=company.id, sku=sku, name=name, category_id=cat_id,
                price=price, cost=cost, min_stock_level=min_stock
            )
            db.session.add(p)
            db.session.flush()
            
            inv = Inventory(product_id=p.id, warehouse_id=w_id, quantity=qty)
            db.session.add(inv)

        db.session.commit()
        print("Seed data loaded successfully!")
        print("Login with:")
        print("Email: admin@technexus.com")
        print("Password: admin123")

if __name__ == "__main__":
    seed_data()
