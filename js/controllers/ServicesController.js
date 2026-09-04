import { ServiceModel } from '../models/ServiceModel.js';
import { CartModel } from '../models/CartModel.js';
import { ServicesView } from '../views/ServicesView.js';

export const ServicesController = {
    init() {
        ServicesView.init();
        this.render('');

        ServicesView.bindAside((category) => this.render(category));
        ServicesView.bindReserve((id) => this.addToCart(id));
    },

    render(category) {
        const services = ServiceModel.getByCategory(category);
        ServicesView.renderServices(services);
    },

    addToCart(id) {
        const service = ServiceModel.getAll().find(s => s.id === id);
        if (!service) return;

        CartModel.add({
            itemId: service.id,
            type: 'service',
            name: service.name,
            price: service.price,
            description: service.description,
            maxStock: 1
        });

        ServicesView.showToast(`"${service.name}" añadido al carrito`);
    }
};
