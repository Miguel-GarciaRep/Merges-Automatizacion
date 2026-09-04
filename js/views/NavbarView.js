import { UserModel } from '../models/UserModel.js';

export const NavbarView = {
    render() {
        const session = UserModel.getSession();
        const authSection = document.getElementById('auth-section');
        if (!authSection) return;

        if (session) {
            authSection.innerHTML = `
                <span class="user-greeting">Bienvenido, <strong>${session.name}</strong></span>
                <button class="btn-outline btn-sm" id="btn-logout">Cerrar sesión</button>
            `;
        } else {
            authSection.innerHTML = `
                <a href="registro.html" class="btn-outline btn-sm">Registrarse</a>
                <a href="login.html" class="btn-primary btn-sm">Iniciar sesión</a>
            `;
        }
    },

    bindLogout(handler) {
        document.getElementById('btn-logout')?.addEventListener('click', handler);
    },

    setActiveLink(page) {
        document.querySelectorAll('header nav a').forEach(link => {
            link.classList.toggle('active', link.dataset.page === page);
        });
    }
};
