import { Storage } from '../utils/storage.js';

const STORAGE_KEY = 'coreshop_orders';
const SEEDED_ORDER_IDS = ['CS-9021', 'CS-8843'];

export const TRACKING_STEPS = [
    { key: 'confirmado', label: 'Confirmado', icon: '✓' },
    { key: 'preparando', label: 'Preparando', icon: '📦' },
    { key: 'en-transito', label: 'En tránsito', icon: '🚚' },
    { key: 'entregado', label: 'Entregado', icon: '🏠' }
];

export const OrderModel = {
    getAll() {
        return Storage.get(STORAGE_KEY, []);
    },

    removeSeededDefaults() {
        const orders = this.getAll().filter(o => !SEEDED_ORDER_IDS.includes(o.id));
        if (orders.length !== this.getAll().length) {
            Storage.set(STORAGE_KEY, orders);
        }
    },

    createFromCart(cartItems, shipping, payment) {
        const hasProducts = cartItems.some(i => i.type === 'product');
        const hasServices = cartItems.some(i => i.type === 'service');
        let estimatedDays = 3;

        if (hasProducts && hasServices) estimatedDays = 5;
        else if (hasProducts) estimatedDays = 5;
        else if (hasServices) estimatedDays = 2;

        const total = cartItems.reduce((sum, i) => sum + i.price * i.quantity, 0);
        const createdAt = Date.now();

        const order = {
            id: `CS-${Date.now().toString().slice(-6)}`,
            date: new Date().toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' }),
            createdAt,
            estimatedDays,
            items: cartItems.map(i => ({
                name: i.name,
                price: i.price,
                quantity: i.quantity,
                description: i.description,
                type: i.type
            })),
            total,
            shipping,
            payment,
            destination: `${shipping.city}, ${shipping.country}`
        };

        const orders = this.getAll();
        orders.unshift(order);
        Storage.set(STORAGE_KEY, orders);
        return order;
    },

    remove(id) {
        const orders = this.getAll().filter(o => o.id !== id);
        Storage.set(STORAGE_KEY, orders);
    },

    getTrackingStage(order) {
        if (!order.createdAt) return 3;
        const elapsedMs = Date.now() - order.createdAt;
        const elapsedDays = elapsedMs / (1000 * 60 * 60 * 24);
        const estimated = order.estimatedDays || 5;

        if (elapsedDays >= estimated) return 3;
        if (elapsedDays >= estimated * 0.6) return 2;
        if (elapsedDays >= estimated * 0.25) return 1;
        return 0;
    },

    getStatus(order) {
        const stage = this.getTrackingStage(order);
        return TRACKING_STEPS[stage].label;
    },

    getElapsedTime(order) {
        if (!order.createdAt) return 'No disponible';
        const elapsedMs = Date.now() - order.createdAt;
        const days = Math.floor(elapsedMs / (1000 * 60 * 60 * 24));
        const hours = Math.floor((elapsedMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));

        if (days > 0) return `${days} día${days !== 1 ? 's' : ''} y ${hours} h`;
        if (hours > 0) return `${hours} hora${hours !== 1 ? 's' : ''}`;
        const minutes = Math.floor(elapsedMs / (1000 * 60));
        return minutes < 1 ? 'Recién realizado' : `${minutes} min`;
    },

    getEstimatedWaitText(order) {
        const days = order.estimatedDays || 5;
        return `${days} día${days !== 1 ? 's' : ''} hábiles`;
    },

    isActive(order) {
        return this.getTrackingStage(order) < 3;
    },

    isCompleted(order) {
        return this.getTrackingStage(order) === 3;
    }
};
