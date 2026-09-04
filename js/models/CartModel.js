import { Storage } from '../utils/storage.js';

const STORAGE_KEY = 'coreshop_cart';

export const CartModel = {
    getAll() {
        return Storage.get(STORAGE_KEY, []);
    },

    add(item) {
        const cart = this.getAll();
        const existing = cart.find(
            i => i.itemId === item.itemId && i.type === item.type
        );

        if (existing) {
            const newQty = existing.quantity + (item.quantity || 1);
            existing.quantity = Math.min(newQty, item.maxStock || 99);
        } else {
            cart.push({
                cartId: `cart-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
                quantity: item.quantity || 1,
                ...item
            });
        }

        Storage.set(STORAGE_KEY, cart);
        return cart;
    },

    updateQuantity(cartId, quantity) {
        const cart = this.getAll();
        const item = cart.find(i => i.cartId === cartId);
        if (!item) return cart;

        item.quantity = Math.max(1, Math.min(quantity, item.maxStock || 99));
        Storage.set(STORAGE_KEY, cart);
        return cart;
    },

    remove(cartId) {
        const cart = this.getAll().filter(i => i.cartId !== cartId);
        Storage.set(STORAGE_KEY, cart);
        return cart;
    },

    clear() {
        Storage.set(STORAGE_KEY, []);
    },

    getTotal() {
        return this.getAll().reduce((sum, i) => sum + i.price * i.quantity, 0);
    },

    getCount() {
        return this.getAll().reduce((sum, i) => sum + i.quantity, 0);
    },

    isEmpty() {
        return this.getAll().length === 0;
    }
};
