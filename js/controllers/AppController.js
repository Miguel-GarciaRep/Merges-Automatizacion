import { NavbarView } from '../views/NavbarView.js';
import { UserModel } from '../models/UserModel.js';

const PUBLIC_PAGES = new Set(['inicio']);

export const AppController = {
    init(page) {
        const file = window.location.pathname.split('/').pop() || 'index.html';
        const isAuthPage = file === 'login.html' || file === 'registro.html';

        if (!PUBLIC_PAGES.has(page) && !isAuthPage && !UserModel.isLoggedIn()) {
            window.location.href = `login.html?redirect=${encodeURIComponent(file)}`;
            return false;
        }

        NavbarView.render();
        NavbarView.setActiveLink(page);
        NavbarView.bindLogout(() => {
            UserModel.logout();
            window.location.href = 'index.html';
        });
        return true;
    }
};
