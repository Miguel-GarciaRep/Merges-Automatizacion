export const HomeController = {
    init() {
        this.bindAside();
        this.bindCTA();
        this.animateStats();
    },

    bindAside() {
        const aside = document.getElementById('aside-nav');
        aside?.addEventListener('click', (e) => {
            const link = e.target.closest('[data-section]');
            if (!link) return;
            e.preventDefault();
            aside.querySelectorAll('a').forEach(a => a.classList.remove('active'));
            link.classList.add('active');

            const section = document.getElementById(link.dataset.section);
            section?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        });
    },

    bindCTA() {
        document.getElementById('btn-explore')?.addEventListener('click', () => {
            window.location.href = 'productos.html';
        });
        document.getElementById('btn-specs')?.addEventListener('click', () => {
            document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' });
        });
    },

    animateStats() {
        document.querySelectorAll('[data-count]').forEach(el => {
            const target = parseInt(el.dataset.count, 10);
            let current = 0;
            const step = Math.ceil(target / 40);
            const timer = setInterval(() => {
                current += step;
                if (current >= target) {
                    current = target;
                    clearInterval(timer);
                }
                el.textContent = current.toLocaleString() + (el.dataset.suffix || '');
            }, 30);
        });
    }
};
