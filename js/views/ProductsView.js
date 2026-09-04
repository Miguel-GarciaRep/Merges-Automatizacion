export const ProductsView = {
    container: null,
    asideNav: null,

    init() {
        this.container = document.getElementById('product-container');
        this.asideNav = document.getElementById('aside-nav');
    },

    renderProducts(products) {
        if (!this.container) return;

        if (products.length === 0) {
            this.container.innerHTML = `
                <div class="empty-state fade-in">
                    <p>No se encontraron productos con los filtros aplicados.</p>
                </div>
            `;
            return;
        }

        this.container.innerHTML = products.map((p, i) => `
            <article class="card fade-in" style="animation-delay: ${i * 0.08}s" data-id="${p.id}">
                <header>
                    <small class="badge ${p.stock > 10 ? '' : 'badge-orange'}">${p.stock > 0 ? 'EN STOCK' : 'AGOTADO'}</small>
                    <small class="badge badge-blue">${p.brand}</small>
                </header>
                <div class="card-icon">${this.getCategoryIcon(p.category)}</div>
                <div>
                    <h3>${p.name}</h3>
                    <p>${p.description}</p>
                    <small class="text-muted">Stock: ${p.stock} unidades</small>
                </div>
                <footer>
                    <strong class="price">$${p.price.toLocaleString()}</strong>
                    <button class="btn-primary btn-sm" data-action="add-order" data-id="${p.id}" ${p.stock === 0 ? 'disabled' : ''}>
                        Añadir al carrito
                    </button>
                </footer>
            </article>
        `).join('');
    },

    getCategoryIcon(category) {
        const icons = {
            'Procesadores': '🔲',
            'Tarjetas Gráficas': '🎮',
            'Memoria': '💾',
            'Almacenamiento': '💿',
            'Placas Base': '🎛️'
        };
        return icons[category] || '🖥️';
    },

    renderAsideCategories(categories, activeCategory) {
        if (!this.asideNav) return;
        this.asideNav.innerHTML = `
            <li><a href="#" data-category="" class="${!activeCategory ? 'active' : ''}">Todos</a></li>
        ` + categories.map(cat => `
            <li><a href="#" data-category="${cat}" class="${cat === activeCategory ? 'active' : ''}">${cat}</a></li>
        `).join('');
    },

    getFilterValues() {
        return {
            name: document.getElementById('filter-name')?.value || '',
            brand: document.getElementById('filter-brand')?.value || '',
            minPrice: document.getElementById('filter-min')?.value || '',
            maxPrice: document.getElementById('filter-max')?.value || ''
        };
    },

    bindFilters(handler) {
        ['filter-name', 'filter-brand', 'filter-min', 'filter-max'].forEach(id => {
            document.getElementById(id)?.addEventListener('input', handler);
        });
    },

    bindAside(handler) {
        this.asideNav?.addEventListener('click', (e) => {
            const link = e.target.closest('[data-category]');
            if (link) {
                e.preventDefault();
                handler(link.dataset.category);
            }
        });
    },

    bindAddOrder(handler) {
        this.container?.addEventListener('click', (e) => {
            const btn = e.target.closest('[data-action="add-order"]');
            if (btn) handler(Number(btn.dataset.id));
        });
    },

    showToast(message, type = 'success') {
        const toast = document.createElement('div');
        toast.className = `toast toast-${type} slide-up`;
        toast.textContent = message;
        document.body.appendChild(toast);
        setTimeout(() => toast.remove(), 3000);
    }
};
