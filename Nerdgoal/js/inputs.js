document.addEventListener('DOMContentLoaded', () => {
    // Função para configurar eventos de input e reset para um formulário específico
    function setupForm(formId, successMessageId) {
        const form = document.getElementById(formId);
        if (!form) return; // Verifica se o formulário existe

        const successMessage = document.getElementById(successMessageId);
        const inputs = form.querySelectorAll('input[type="text"], input[type="number"], input[type="email"], input[type="password"], textarea');

        inputs.forEach(input => {
            input.addEventListener('input', () => {
                input.classList.add('input-active');
            });
        });

        form.addEventListener('submit', (event) => {
            event.preventDefault();
            if (successMessage) {
                successMessage.classList.remove('d-none');
                setTimeout(() => {
                    successMessage.classList.add('d-none');
                }, 5000);
            }
            resetForm(form, inputs);
        });

        window.limparFormulario = function() {
            resetForm(form, inputs);
        };
    }

    function resetForm(form, inputs) {
        form.reset();
        inputs.forEach(input => {
            input.classList.remove('input-active');
        });
    }

    // Configurando cada formulário individualmente
    setupForm('form-reclamacao', 'mensagem-sucesso');
    setupForm('registrationForm', 'successMessage');
    setupForm('loginForm', 'loginSuccessMessage');
    setupForm('forgotPasswordForm', 'forgotPasswordSuccessMessage');
});


