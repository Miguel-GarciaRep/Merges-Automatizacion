export const ServicesView = {
    container: null,
    asideNav: null,

    init() {
        this.container = document.getElementById('services-container');
        this.asideNav = document.getElementById('aside-nav');
    },

    renderServices(services) {
        if (!this.container) return;
        this.container.innerHTML = services.map((s, i) => `
            <article class="card fade-in" style="animation-delay: ${i * 0.1}s">
                <header>
                    <small class="badge ${s.badge === 'AVANZADO' ? 'badge-orange' : ''}">${s.badge}</small>
                </header>
                <div class="card-icon service-icon">🛠️</div>
                <div>
                    <h3>${s.name}</h3>
                    <p>${s.description}</p>
                </div>
                <footer>
                    <strong class="price">$${s.price}</strong>
                    <button class="btn-primary btn-sm" data-action="reserve" data-id="${s.id}">Añadir al carrito</button>
                </footer>
            </article>
        `).join('');
    },

    bindAside(handler) {
        this.asideNav?.addEventListener('click', (e) => {
            const link = e.target.closest('[data-category]');
            if (link) {
                e.preventDefault();
                this.asideNav.querySelectorAll('a').forEach(a => a.classList.remove('active'));
                link.classList.add('active');
                handler(link.dataset.category);
            }
        });
    },

    bindReserve(handler) {
        this.container?.addEventListener('click', (e) => {
            const btn = e.target.closest('[data-action="reserve"]');
            if (btn) handler(Number(btn.dataset.id));
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
