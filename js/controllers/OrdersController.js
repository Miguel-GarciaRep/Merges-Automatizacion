import { OrderModel } from '../models/OrderModel.js';
import { OrdersView } from '../views/OrdersView.js';

export const OrdersController = {
    init() {
        OrdersView.init();
        OrderModel.removeSeededDefaults();
        this.render();
        this.bindSync();

        OrdersView.bindAside((filter) => {
            OrdersView.activeFilter = filter;
            this.render();
        });

        OrdersView.bindActions((id) => {
            OrderModel.remove(id);
            this.render();
            OrdersView.showToast('Pedido eliminado');
        });
    },

    render() {
        OrdersView.renderOrders(OrderModel.getAll());
    },

    bindSync() {
        window.addEventListener('storage', (e) => {
            if (e.key === 'coreshop_orders') this.render();
        });
        document.addEventListener('visibilitychange', () => {
            if (document.visibilityState === 'visible') this.render();
        });
    }
};
