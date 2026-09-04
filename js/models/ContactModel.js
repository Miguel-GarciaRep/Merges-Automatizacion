import { Storage } from '../utils/storage.js';

const STORAGE_KEY = 'coreshop_contacts';

export const ContactModel = {
    getAll() {
        return Storage.get(STORAGE_KEY, []);
    },

    save(message) {
        const contacts = this.getAll();
        contacts.unshift({ ...message, id: Date.now(), date: new Date().toISOString() });
        Storage.set(STORAGE_KEY, contacts);
        return contacts[0];
    }
};
