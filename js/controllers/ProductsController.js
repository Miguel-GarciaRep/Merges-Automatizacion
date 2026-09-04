import { ProductModel } from '../models/ProductModel.js';
import { CartModel } from '../models/CartModel.js';
import { ProductsView } from '../views/ProductsView.js';

export const ProductsController = {
    activeCategory: '',

    init() {
        ProductsView.init();

        const categories = ProductModel.getCategories();
        ProductsView.renderAsideCategories(categories, this.activeCategory);
        this.render();

        ProductsView.bindFilters(() => this.render());
        ProductsView.bindAside((category) => {
            this.activeCategory = category;
            ProductsView.renderAsideCategories(categories, category);
            this.render();
        });
        ProductsView.bindAddOrder((id) => this.addToCart(id));
    },

    render() {
        const filters = ProductsView.getFilterValues();
        const products = ProductModel.filter({ ...filters, category: this.activeCategory });
        ProductsView.renderProducts(products);
    },

    addToCart(id) {
        const product = ProductModel.getById(id);
        if (!product || product.stock === 0) return;

        CartModel.add({
            itemId: product.id,
            type: 'product',
            name: product.name,
            price: product.price,
            description: product.description,
            maxStock: product.stock
        });

        ProductsView.showToast(`${product.name} añadido al carrito`);
    }
};
