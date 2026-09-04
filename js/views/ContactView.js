export const ContactView = {
    form: null,
    asideNav: null,
    messagesList: null,
    activeTopic: 'Soporte Técnico',

    init() {
        this.form = document.getElementById('contact-form');
        this.asideNav = document.getElementById('aside-nav');
        this.messagesList = document.getElementById('messages-list');
    },

    bindForm(handler) {
        this.form?.addEventListener('submit', (e) => {
            e.preventDefault();
            if (!this.form.checkValidity()) {
                this.form.reportValidity();
                return;
            }
            const formData = new FormData(this.form);
            handler({
                name: formData.get('name'),
                email: formData.get('email'),
                subject: formData.get('subject'),
                message: formData.get('message'),
                topic: this.activeTopic
            });
        });
    },

    bindAside(handler) {
        this.asideNav?.addEventListener('click', (e) => {
            const link = e.target.closest('[data-topic]');
            if (link) {
                e.preventDefault();
                this.asideNav.querySelectorAll('a').forEach(a => a.classList.remove('active'));
                link.classList.add('active');
                this.activeTopic = link.dataset.topic;
                handler(this.activeTopic);
            }
        });
    },

    updateHeader(topic) {
        const titles = {
            'Soporte Técnico': { title: 'Soporte Técnico', desc: 'Abre un ticket con nuestro equipo de ingeniería.' },
            'Ventas': { title: 'Departamento de Ventas', desc: 'Consultas sobre productos, precios y disponibilidad.' },
            'Corporativo': { title: 'Consultas Corporativas', desc: 'Soluciones empresariales y pedidos al por mayor.' },
            'Ubicaciones': { title: 'Ubicaciones de Tiendas', desc: 'Encuentra nuestras tiendas físicas más cercanas.' }
        };
        const info = titles[topic] || titles['Soporte Técnico'];
        document.getElementById('contact-title').textContent = info.title;
        document.getElementById('contact-desc').textContent = info.desc;
    },

    renderMessages(messages) {
        if (!this.messagesList) return;
        const recent = messages.slice(0, 5);
        this.messagesList.innerHTML = recent.length === 0
            ? '<p class="text-muted">Sin mensajes enviados aún.</p>'
            : recent.map(m => `
                <div class="aside-message fade-in">
                    <strong>${m.subject}</strong>
                    <small>${m.name} · ${new Date(m.date).toLocaleDateString('es-ES')}</small>
                </div>
            `).join('');
    },

    resetForm() {
        this.form?.reset();
    },

    showSuccess() {
        const toast = document.createElement('div');
        toast.className = 'toast toast-success slide-up';
        toast.textContent = '¡Mensaje enviado correctamente! Te responderemos pronto.';
        document.body.appendChild(toast);
        setTimeout(() => toast.remove(), 3500);
    }
};
