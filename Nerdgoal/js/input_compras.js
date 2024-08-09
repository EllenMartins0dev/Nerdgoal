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

    // Função para adicionar evento de input aos novos inputs dinâmicos
    function addInputEventListeners() {
        const dynamicInputs = document.querySelectorAll('#payment-details input[type="text"], #cep');
        dynamicInputs.forEach(input => {
            input.addEventListener('input', () => {
                input.classList.add('input-active');
            });
        });
    }

    // Monitorando mudanças no conteúdo do elemento de detalhes de pagamento
    const paymentDetails = document.getElementById('payment-details');
    if (paymentDetails) {
        const observer = new MutationObserver(() => {
            addInputEventListeners();
        });

        observer.observe(paymentDetails, { childList: true });
    }

    // Adicionando manipuladores de eventos para os botões "Cancelar" e "Finalizar Compra"
    document.querySelectorAll('.cancel-button, .complete-button, .close').forEach(button => {
        button.addEventListener('click', () => {
            resetForm(document.getElementById('order-popup').querySelector('form'), document.querySelectorAll('#order-popup input[type="text"], #order-popup input[type="number"], #order-popup input[type="email"], #order-popup input[type="password"], #order-popup textarea, #order-popup #cep'));
            document.getElementById('cep').classList.remove('input-active'); // Remover classe 'input-active' especificamente do CEP
            document.getElementById('cep').style.backgroundColor = ''; // Resetar o fundo
            document.getElementById('cep').style.color = ''; // Resetar a cor do texto
        });
    });

    // Monitorar o input do CEP para aplicar estilos quando estiver ativo
    const cepInput = document.getElementById('cep');
    if (cepInput) {
        cepInput.addEventListener('input', () => {
            cepInput.classList.add('input-active');
            cepInput.style.backgroundColor = 'white'; // Fundo branco ao digitar
            cepInput.style.color = 'black'; // Texto preto ao digitar
        });
    }

    // Chamando a função para adicionar os eventos aos inputs dinâmicos inicialmente
    addInputEventListeners();
});
