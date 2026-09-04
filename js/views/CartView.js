export const CartView = {
    container: null,

    init() {
        this.container = document.getElementById('cart-container');
    },

    render(cart, total) {
        if (!this.container) return;

        if (cart.length === 0) {
            this.container.innerHTML = `
                <div class="empty-state fade-in">
                    <p>Tu carrito está vacío. Añade productos o servicios para comenzar.</p>
                    <div class="empty-state-actions">
                        <a href="productos.html" class="btn-primary">Ver productos</a>
                        <a href="servicios.html" class="btn-outline">Ver servicios</a>
                    </div>
                </div>
            `;
            return;
        }

        this.container.innerHTML = `
            <div class="cart-layout fade-in">
                <div class="cart-items">
                    ${cart.map((item, i) => `
                        <article class="cart-item" data-cart-id="${item.cartId}" style="animation-delay:${i * 0.06}s">
                            <div class="cart-item-info">
                                <span class="badge ${item.type === 'service' ? 'badge-blue' : ''}">${item.type === 'service' ? 'Servicio' : 'Producto'}</span>
                                <h3>${item.name}</h3>
                                <p class="text-muted">${item.description}</p>
                            </div>
                            <div class="cart-item-controls">
                                <div class="qty-control">
                                    <button class="btn-outline btn-sm" data-action="decrease" data-id="${item.cartId}" ${item.quantity <= 1 ? 'disabled' : ''}>−</button>
                                    <span class="qty-value">${item.quantity}</span>
                                    <button class="btn-outline btn-sm" data-action="increase" data-id="${item.cartId}" ${item.quantity >= (item.maxStock || 99) ? 'disabled' : ''}>+</button>
                                </div>
                                <strong class="price">$${(item.price * item.quantity).toLocaleString()}</strong>
                                <button class="btn-outline btn-sm btn-danger" data-action="remove" data-id="${item.cartId}">Quitar</button>
                            </div>
                        </article>
                    `).join('')}
                </div>
                <aside class="cart-summary">
                    <h3>Resumen</h3>
                    <div class="summary-row">
                        <span>Artículos</span>
                        <strong>${cart.reduce((n, i) => n + i.quantity, 0)}</strong>
                    </div>
                    <div class="summary-row summary-total">
                        <span>Total</span>
                        <strong class="price">$${total.toLocaleString()}</strong>
                    </div>
                    <button class="btn-primary" id="btn-checkout" style="width:100%;">Comprar</button>
                    <p class="text-muted cart-hint">Se abrirá una nueva pestaña para completar tu dirección y datos de envío.</p>
                </aside>
            </div>
        `;
    },

    bindActions(handlers) {
        this.container?.addEventListener('click', (e) => {
            if (e.target.closest('#btn-checkout')) {
                handlers.onCheckout();
                return;
            }

            const btn = e.target.closest('[data-action]');
            if (!btn) return;

            const id = btn.dataset.id;
            const action = btn.dataset.action;
            if (action === 'increase') handlers.onIncrease(id);
            if (action === 'decrease') handlers.onDecrease(id);
            if (action === 'remove') handlers.onRemove(id);
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
