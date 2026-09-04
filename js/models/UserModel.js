import { Storage } from '../utils/storage.js';

const USERS_KEY = 'coreshop_users';
const SESSION_KEY = 'coreshop_session';

export const UserModel = {
    getUsers() {
        return Storage.get(USERS_KEY, []);
    },

    register({ name, email, password }) {
        const users = this.getUsers();
        if (users.some(u => u.email === email)) {
            return { success: false, message: 'Este correo ya está registrado.' };
        }
        users.push({ name, email, password, provider: 'email', createdAt: Date.now() });
        Storage.set(USERS_KEY, users);
        const session = { name, email, provider: 'email' };
        Storage.set(SESSION_KEY, session);
        return { success: true, user: session };
    },

    login({ email, password }) {
        const user = this.getUsers().find(u => u.email === email && u.password === password);
        if (!user) {
            return { success: false, message: 'Credenciales incorrectas.' };
        }
        const session = { name: user.name, email: user.email, provider: user.provider };
        Storage.set(SESSION_KEY, session);
        return { success: true, user: session };
    },

    socialLogin(provider, name, email) {
        const session = { name, email, provider };
        Storage.set(SESSION_KEY, session);
        const users = this.getUsers();
        if (!users.some(u => u.email === email)) {
            users.push({ name, email, provider, createdAt: Date.now() });
            Storage.set(USERS_KEY, users);
        }
        return { success: true, user: session };
    },

    getSession() {
        return Storage.get(SESSION_KEY);
    },

    logout() {
        Storage.remove(SESSION_KEY);
    },

    isLoggedIn() {
        return !!this.getSession();
    }
};
