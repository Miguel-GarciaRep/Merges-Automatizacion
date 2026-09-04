import { CartModel } from '../models/CartModel.js';
import { CartView } from '../views/CartView.js';

export const CartController = {
    init() {
        CartView.init();
        this.render();
        this.bindSync();

        CartView.bindActions({
            onIncrease: (id) => {
                const item = CartModel.getAll().find(i => i.cartId === id);
                if (item) {
                    CartModel.updateQuantity(id, item.quantity + 1);
                    this.render();
                }
            },
            onDecrease: (id) => {
                const item = CartModel.getAll().find(i => i.cartId === id);
                if (item) {
                    CartModel.updateQuantity(id, item.quantity - 1);
                    this.render();
                }
            },
            onRemove: (id) => {
                CartModel.remove(id);
                this.render();
                CartView.showToast('Artículo eliminado del carrito');
            },
            onCheckout: () => {
                if (CartModel.isEmpty()) return;
                window.open('comprar.html', '_blank');
            }
        });
    },

    render() {
        CartView.render(CartModel.getAll(), CartModel.getTotal());
    },

    bindSync() {
        window.addEventListener('storage', (e) => {
            if (e.key === 'coreshop_cart') this.render();
        });
        document.addEventListener('visibilitychange', () => {
            if (document.visibilityState === 'visible') this.render();
        });
    }
};
