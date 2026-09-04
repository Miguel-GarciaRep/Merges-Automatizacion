export const AuthView = {
    form: null,
    feedback: null,

    init(formId, feedbackId) {
        this.form = document.getElementById(formId);
        this.feedback = document.getElementById(feedbackId);
    },

    bindForm(handler) {
        this.form?.addEventListener('submit', (e) => {
            e.preventDefault();
            if (!this.form.checkValidity()) {
                this.form.reportValidity();
                return;
            }
            const formData = new FormData(this.form);
            handler(Object.fromEntries(formData));
        });
    },

    bindSocial(handler) {
        document.querySelectorAll('[data-provider]').forEach(btn => {
            btn.addEventListener('click', () => handler(btn.dataset.provider));
        });
    },

    showFeedback(message, isError = false) {
        if (!this.feedback) return;
        this.feedback.textContent = message;
        this.feedback.className = `auth-feedback ${isError ? 'error' : 'success'} fade-in`;
    },

    clearFeedback() {
        if (this.feedback) this.feedback.textContent = '';
    }
};
