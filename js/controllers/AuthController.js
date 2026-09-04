import { UserModel } from '../models/UserModel.js';
import { AuthView } from '../views/AuthView.js';

const SOCIAL_PROFILES = {
    google: { name: 'Usuario Google', email: 'usuario@gmail.com' },
    github: { name: 'Usuario GitHub', email: 'dev@github.com' },
    microsoft: { name: 'Usuario Microsoft', email: 'usuario@outlook.com' },
    apple: { name: 'Usuario Apple', email: 'usuario@icloud.com' }
};

const ALLOWED_REDIRECTS = new Set([
    'index.html',
    'productos.html',
    'servicios.html',
    'pedidos.html',
    'contacto.html',
    'comprar.html'
]);

function getRedirectUrl() {
    const redirect = new URLSearchParams(window.location.search).get('redirect');
    return redirect && ALLOWED_REDIRECTS.has(redirect) ? redirect : 'index.html';
}

function getRedirectQuery() {
    const redirect = new URLSearchParams(window.location.search).get('redirect');
    return redirect && ALLOWED_REDIRECTS.has(redirect) ? `?redirect=${encodeURIComponent(redirect)}` : '';
}

export const AuthController = {
    init(mode = 'login') {
        const formId = mode === 'login' ? 'login-form' : 'register-form';
        AuthView.init(formId, 'auth-feedback');
        this.bindRedirectLinks(mode);

        const redirectUrl = getRedirectUrl();
        if (redirectUrl !== 'index.html') {
            AuthView.showFeedback('Inicia sesión o crea una cuenta para acceder a esta sección.');
        }

        AuthView.bindForm((data) => {
            AuthView.clearFeedback();
            const result = mode === 'login'
                ? UserModel.login(data)
                : UserModel.register(data);

            if (result.success) {
                AuthView.showFeedback(`¡Bienvenido, ${result.user.name}! Redirigiendo...`);
                setTimeout(() => { window.location.href = redirectUrl; }, 1200);
            } else {
                AuthView.showFeedback(result.message, true);
            }
        });

        AuthView.bindSocial((provider) => {
            const profile = SOCIAL_PROFILES[provider];
            if (!profile) return;
            UserModel.socialLogin(provider, profile.name, profile.email);
            AuthView.showFeedback(`Sesión iniciada con ${provider}. Redirigiendo...`);
            setTimeout(() => { window.location.href = redirectUrl; }, 1200);
        });
    },

    bindRedirectLinks(mode) {
        const query = getRedirectQuery();
        const footerLink = document.querySelector('.auth-footer a');
        if (!footerLink) return;

        if (mode === 'login') {
            footerLink.href = `registro.html${query}`;
        } else {
            footerLink.href = `login.html${query}`;
        }
    }
};
