import { OrderModel, TRACKING_STEPS } from '../models/OrderModel.js';

export const OrdersView = {
    container: null,
    asideNav: null,
    activeFilter: 'all',

    init() {
        this.container = document.getElementById('orders-container');
        this.asideNav = document.getElementById('aside-nav');
    },

    renderOrders(orders) {
        if (!this.container) return;

        const filtered = this.filterOrders(orders);

        if (filtered.length === 0) {
            this.container.innerHTML = `
                <div class="empty-state fade-in">
                    <p>No hay pedidos en esta categoría. Completa una compra desde tu carrito para ver el seguimiento aquí.</p>
                </div>
            `;
            return;
        }

        this.container.innerHTML = `
            <div class="orders-grid">
                ${filtered.map((o, i) => this.renderOrderCard(o, i)).join('')}
            </div>
        `;
    },

    renderOrderCard(order, index) {
        const stage = OrderModel.getTrackingStage(order);
        const status = OrderModel.getStatus(order);
        const elapsed = OrderModel.getElapsedTime(order);
        const estimated = OrderModel.getEstimatedWaitText(order);
        const items = order.items || [{ name: order.name, price: order.price, quantity: 1, description: order.description }];
        const total = order.total ?? items.reduce((s, i) => s + i.price * (i.quantity || 1), 0);

        return `
            <article class="order-card fade-in" style="animation-delay: ${index * 0.1}s" data-id="${order.id}">
                <header>
                    <span class="order-id">${order.id}</span>
                    <span class="status status-${status.toLowerCase().replace(/\s/g, '-')}">${status}</span>
                </header>
                <div class="order-body">
                    <div class="order-items-list">
                        ${items.map(item => `
                            <div class="order-item-row">
                                <div>
                                    <strong>${item.name}</strong>
                                    ${item.quantity > 1 ? `<span class="text-muted"> × ${item.quantity}</span>` : ''}
                                    <p class="order-desc">${item.description}</p>
                                </div>
                                <strong class="price">$${(item.price * (item.quantity || 1)).toLocaleString()}</strong>
                            </div>
                        `).join('')}
                    </div>

                    <div class="tracking-section">
                        <h4>Seguimiento del pedido</h4>
                        <div class="tracking-timeline">
                            ${TRACKING_STEPS.map((step, idx) => `
                                <div class="tracking-step ${idx < stage ? 'completed' : ''} ${idx === stage ? 'active' : ''} ${idx > stage ? 'pending' : ''}">
                                    <div class="step-marker">${step.icon}</div>
                                    <span class="step-label">${step.label}</span>
                                </div>
                            `).join('')}
                        </div>
                        <div class="tracking-times">
                            <div class="time-card">
                                <span class="label">Tiempo de espera estimado</span>
                                <strong>${estimated}</strong>
                            </div>
                            <div class="time-card">
                                <span class="label">Tiempo real de espera</span>
                                <strong>${elapsed}</strong>
                            </div>
                        </div>
                    </div>

                    <div class="order-meta">
                        <div><span class="label">Total</span><strong class="price">$${total.toLocaleString()}</strong></div>
                        <div><span class="label">Fecha</span><strong>${order.date}</strong></div>
                        <div><span class="label">Destino</span><strong>${order.destination || '—'}</strong></div>
                        ${order.payment ? `<div><span class="label">Pago</span><strong>${order.payment.label}${this.formatPaymentDetail(order.payment)}</strong></div>` : ''}
                    </div>

                    ${order.shipping ? `
                        <details class="shipping-details">
                            <summary>Datos de envío</summary>
                            <div class="shipping-info">
                                <p><strong>${order.shipping.fullName}</strong></p>
                                <p>${order.shipping.street}</p>
                                <p>${order.shipping.zip} ${order.shipping.city}, ${order.shipping.state}</p>
                                <p>${order.shipping.country}</p>
                                <p class="text-muted">${order.shipping.phone} · ${order.shipping.email}</p>
                                ${order.shipping.notes ? `<p class="text-muted">Notas: ${order.shipping.notes}</p>` : ''}
                            </div>
                        </details>
                    ` : ''}
                </div>
                <footer>
                    <button class="btn-outline btn-sm btn-danger" data-action="remove-order" data-id="${order.id}">Eliminar pedido</button>
                </footer>
            </article>
        `;
    },

    formatPaymentDetail(payment) {
        if (!payment?.details) return '';
        if (payment.method === 'card') return ` ·••• ${payment.details.cardLast4}`;
        if (payment.method === 'paypal') return ` · ${payment.details.email}`;
        if (payment.method === 'bizum') return ` · ${payment.details.phone}`;
        if (payment.method === 'transfer') return ' · Pendiente';
        return '';
    },

    filterOrders(orders) {
        switch (this.activeFilter) {
            case 'active': return orders.filter(o => OrderModel.isActive(o));
            case 'completed': return orders.filter(o => OrderModel.isCompleted(o));
            default: return orders;
        }
    },

    bindAside(handler) {
        this.asideNav?.addEventListener('click', (e) => {
            const link = e.target.closest('[data-filter]');
            if (link) {
                e.preventDefault();
                this.asideNav.querySelectorAll('a[data-filter]').forEach(a => a.classList.remove('active'));
                link.classList.add('active');
                document.getElementById('orders-section')?.scrollIntoView({ behavior: 'smooth' });
                handler(link.dataset.filter);
            }
        });
    },

    bindActions(removeHandler) {
        this.container?.addEventListener('click', (e) => {
            const removeBtn = e.target.closest('[data-action="remove-order"]');
            if (removeBtn) removeHandler(removeBtn.dataset.id);
        });
    },

    showToast(message) {
        const toast = document.createElement('div');
        toast.className = 'toast toast-success slide-up';
        toast.textContent = message;
        document.body.appendChild(toast);
        setTimeout(() => toast.remove(), 3000);
    }
};
