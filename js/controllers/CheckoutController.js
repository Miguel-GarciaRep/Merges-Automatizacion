import { CartModel } from '../models/CartModel.js';
import { OrderModel } from '../models/OrderModel.js';
import { UserModel } from '../models/UserModel.js';
import { CheckoutView } from '../views/CheckoutView.js';

export const CheckoutController = {
    init() {
        if (CartModel.isEmpty()) {
            window.location.href = 'pedidos.html';
            return;
        }

        CheckoutView.init();
        CheckoutView.renderSummary(CartModel.getAll(), CartModel.getTotal());
        CheckoutView.prefillUser(UserModel.getSession());

        CheckoutView.bindForm(({ shipping, payment }) => {
            const cart = CartModel.getAll();
            const order = OrderModel.createFromCart(cart, shipping, payment);
            CartModel.clear();
            CheckoutView.showSuccess(order.id, payment);
        });
    }
};
