export const PAYMENT_LABELS = {
    card: 'Tarjeta de crédito/débito',
    paypal: 'PayPal',
    bizum: 'Bizum',
    transfer: 'Transferencia bancaria'
};

export const CheckoutView = {
    summaryEl: null,
    form: null,
    feedbackEl: null,

    init() {
        this.summaryEl = document.getElementById('checkout-summary');
        this.form = document.getElementById('checkout-form');
        this.feedbackEl = document.getElementById('checkout-feedback');
        this.bindPaymentToggle();
    },

    renderSummary(cart, total) {
        if (!this.summaryEl) return;

        this.summaryEl.innerHTML = `
            <h3>Tu pedido (${cart.reduce((n, i) => n + i.quantity, 0)} artículos)</h3>
            <ul class="checkout-items">
                ${cart.map(item => `
                    <li>
                        <span>${item.name} × ${item.quantity}</span>
                        <strong>$${(item.price * item.quantity).toLocaleString()}</strong>
                    </li>
                `).join('')}
            </ul>
            <div class="summary-row summary-total">
                <span>Total a pagar</span>
                <strong class="price">$${total.toLocaleString()}</strong>
            </div>
        `;
    },

    bindPaymentToggle() {
        const radios = this.form?.querySelectorAll('[name="paymentMethod"]');
        radios?.forEach(radio => {
            radio.addEventListener('change', () => this.showPaymentPanel(radio.value));
        });
        this.showPaymentPanel(this.getSelectedPaymentMethod());
    },

    showPaymentPanel(method) {
        document.querySelectorAll('.payment-panel').forEach(panel => {
            panel.classList.toggle('hidden', panel.dataset.panel !== method);
        });

        const cardFields = ['cardNumber', 'cardName', 'cardExpiry', 'cardCvv'];
        const paypalFields = ['paypalEmail'];
        const bizumFields = ['bizumPhone'];

        cardFields.forEach(name => {
            const el = this.form?.querySelector(`[name="${name}"]`);
            if (el) el.required = method === 'card';
        });
        paypalFields.forEach(name => {
            const el = this.form?.querySelector(`[name="${name}"]`);
            if (el) el.required = method === 'paypal';
        });
        bizumFields.forEach(name => {
            const el = this.form?.querySelector(`[name="${name}"]`);
            if (el) el.required = method === 'bizum';
        });
    },

    getSelectedPaymentMethod() {
        return this.form?.querySelector('[name="paymentMethod"]:checked')?.value || 'card';
    },

    validatePayment(data) {
        const method = data.paymentMethod;

        if (method === 'card') {
            const digits = (data.cardNumber || '').replace(/\s/g, '');
            if (!/^\d{16}$/.test(digits)) {
                return { valid: false, message: 'Introduce un número de tarjeta válido (16 dígitos).' };
            }
            if (!data.cardName?.trim()) {
                return { valid: false, message: 'Introduce el titular de la tarjeta.' };
            }
            if (!/^\d{2}\/\d{2}$/.test(data.cardExpiry || '')) {
                return { valid: false, message: 'La caducidad debe tener el formato MM/AA.' };
            }
            if (!/^\d{3,4}$/.test(data.cardCvv || '')) {
                return { valid: false, message: 'Introduce un CVV válido (3 o 4 dígitos).' };
            }
            return {
                valid: true,
                payment: {
                    method,
                    label: PAYMENT_LABELS[method],
                    details: {
                        cardLast4: digits.slice(-4),
                        cardName: data.cardName.trim()
                    }
                }
            };
        }

        if (method === 'paypal') {
            if (!data.paypalEmail?.trim()) {
                return { valid: false, message: 'Introduce tu correo de PayPal.' };
            }
            return {
                valid: true,
                payment: {
                    method,
                    label: PAYMENT_LABELS[method],
                    details: { email: data.paypalEmail.trim() }
                }
            };
        }

        if (method === 'bizum') {
            const phone = (data.bizumPhone || '').replace(/\s/g, '');
            if (phone.length < 9) {
                return { valid: false, message: 'Introduce un teléfono válido para Bizum.' };
            }
            return {
                valid: true,
                payment: {
                    method,
                    label: PAYMENT_LABELS[method],
                    details: { phone: data.bizumPhone.trim() }
                }
            };
        }

        if (method === 'transfer') {
            return {
                valid: true,
                payment: {
                    method,
                    label: PAYMENT_LABELS[method],
                    details: { iban: 'ES12 3456 7890 1234 5678 9012' }
                }
            };
        }

        return { valid: false, message: 'Selecciona un método de pago.' };
    },

    bindForm(handler) {
        this.form?.addEventListener('submit', (e) => {
            e.preventDefault();
            this.clearFeedback();
            const data = Object.fromEntries(new FormData(this.form));
            const paymentResult = this.validatePayment(data);

            if (!paymentResult.valid) {
                this.showFeedback(paymentResult.message, true);
                return;
            }

            const { paymentMethod, cardNumber, cardName, cardExpiry, cardCvv, paypalEmail, bizumPhone, ...shipping } = data;
            handler({ shipping, payment: paymentResult.payment });
        });
    },

    prefillUser(session) {
        if (!session || !this.form) return;
        const nameField = this.form.querySelector('[name="fullName"]');
        const emailField = this.form.querySelector('[name="email"]');
        if (nameField && !nameField.value) nameField.value = session.name;
        if (emailField && !emailField.value) emailField.value = session.email;
    },

    clearFeedback() {
        if (!this.feedbackEl) return;
        this.feedbackEl.textContent = '';
        this.feedbackEl.className = '';
    },

    showFeedback(message, isError = false) {
        if (!this.feedbackEl) return;
        this.feedbackEl.textContent = message;
        this.feedbackEl.className = isError ? 'feedback-error' : 'feedback-success';
    },

    showSuccess(orderId, payment) {
        const main = document.querySelector('main');
        if (!main) return;

        const paymentDetail = this.getPaymentSuccessText(payment);

        main.innerHTML = `
            <div class="checkout-success fade-in">
                <div class="success-icon">✓</div>
                <h2>¡Pedido confirmado!</h2>
                <p>Tu pedido <strong>${orderId}</strong> ha sido registrado correctamente.</p>
                <p class="text-muted">Pago con <strong>${payment.label}</strong>${paymentDetail ? ` — ${paymentDetail}` : ''}.</p>
                <p class="text-muted">Puedes seguir su estado y tiempos de espera en la sección de pedidos.</p>
                <div class="success-actions">
                    <a href="pedidos.html" class="btn-primary">Ver mis pedidos</a>
                    <button class="btn-outline" onclick="window.close()">Cerrar pestaña</button>
                </div>
            </div>
        `;
    },

    getPaymentSuccessText(payment) {
        if (!payment?.details) return '';
        if (payment.method === 'card') return `tarjeta terminada en ${payment.details.cardLast4}`;
        if (payment.method === 'paypal') return payment.details.email;
        if (payment.method === 'bizum') return payment.details.phone;
        if (payment.method === 'transfer') return 'pendiente de confirmación';
        return '';
    }
};
