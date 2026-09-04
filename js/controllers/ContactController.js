import { ContactModel } from '../models/ContactModel.js';
import { ContactView } from '../views/ContactView.js';

export const ContactController = {
    init() {
        ContactView.init();
        ContactView.updateHeader(ContactView.activeTopic);
        ContactView.renderMessages(ContactModel.getAll());

        ContactView.bindForm((data) => {
            ContactModel.save(data);
            ContactView.resetForm();
            ContactView.showSuccess();
            ContactView.renderMessages(ContactModel.getAll());
        });

        ContactView.bindAside((topic) => {
            ContactView.updateHeader(topic);
        });
    }
};
