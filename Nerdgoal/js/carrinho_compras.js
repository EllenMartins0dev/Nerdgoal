let cart = JSON.parse(localStorage.getItem('cart')) || [];
let subtotal = 0;
let shippingCost = 0;
let addingToCart = false;

function addToCart(item) {
    if (addingToCart) {
        return;
    }

    addingToCart = true; 

    const newItem = JSON.parse(JSON.stringify(item));

    const existingItemIndex = cart.findIndex(cartItem => cartItem.title === newItem.title);
    if (existingItemIndex >= 0) {
        cart[existingItemIndex].quantity++;
    } else {
        newItem.quantity = 1;
        cart.push(newItem);
    }
    
    updateCartCount();
    renderCartItems();
    saveCartToLocalStorage();

    // Reseta a variável de controle após um curto intervalo de tempo
    setTimeout(() => {
        addingToCart = false;
    }, 1000); // Ajuste conforme necessário
}

function updateCartCount() {
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    document.getElementById('cart-count').innerText = totalItems;
}

function toggleCart() {
    document.getElementById('cart-sidebar').classList.toggle('open');
}

function clearCart() {
    cart = [];
    updateCartCount();
    renderCartItems();
    saveCartToLocalStorage();
}

function finalizePurchase() {
    if (cart.length === 0) {
        alert('Nada foi encontrado');
    } else {
        toggleOrderPopup();
    }
}

function renderCartItems() {
    const cartItemsContainer = document.getElementById('cart-items');
    cartItemsContainer.innerHTML = '';
    if (cart.length === 0) {
        cartItemsContainer.innerHTML = '<p>Nada foi encontrado</p>';
    } else {
        cart.forEach((item, index) => {
            const itemElement = document.createElement('div');
            itemElement.classList.add('cart-item');
            itemElement.innerHTML = `
                <img src="${item.image}" alt="${item.title}">
                <p>${item.title} - R$ ${item.price.toFixed(2)}</p>
                <div class="item-quantity">
                    <button onclick="changeQuantity(${index}, -1)">-</button>
                    <input type="text" value="${item.quantity}" readonly>
                    <button onclick="changeQuantity(${index}, 1)">+</button>
                </div>
                <button class="btn btn-danger btn-remove-cart-item btn-sm" onclick="removeCartItem(${index})">Remover</button>
            `;
            cartItemsContainer.appendChild(itemElement);
        });
    }
    updateCartTotal();
}

function changeQuantity(index, delta) {
    cart[index].quantity += delta;
    if (cart[index].quantity <= 0) {
        cart.splice(index, 1);
    }
    updateCartCount();
    renderCartItems();
    saveCartToLocalStorage();
}

function removeCartItem(index) {
    cart.splice(index, 1);
    updateCartCount();
    renderCartItems();
    saveCartToLocalStorage();
}

function updateCartTotal() {
    subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    document.getElementById('cart-total').innerText = `Total: R$ ${subtotal.toFixed(2)}`;
}

function saveCartToLocalStorage() {
    localStorage.setItem('cart', JSON.stringify(cart));
}

document.querySelectorAll('.btn-warning').forEach((button) => {
    button.addEventListener('click', (event) => {
        event.preventDefault();
        const productCard = event.target.closest('.card-body');
        const title = productCard.querySelector('.card-title').innerText;
        const price = parseFloat(productCard.querySelector('.card-price').innerText.replace('R$', '').trim());
        const image = productCard.closest('.card').querySelector('img').src;
        addToCart({ title, price, image });
    });
});

document.addEventListener('DOMContentLoaded', () => {
    renderCartItems();
    updateCartCount();
});




/* Pop-up */
// Limpar detalhes do pedido ao cancelar
function cancelOrder() {
    document.getElementById('cep').value = '';
    document.getElementById('successMessage').classList.add('d-none');
    document.getElementById('errorMessage').classList.add('d-none');
    toggleOrderPopup();
    document.getElementById('shipping-cost').innerText = 'Frete: R$ 0,00';
    shippingCost = 0;
    updateOrderTotal();
    document.getElementById('payment-details').innerHTML = '';

    // Resetar para a opção "Selecione" no método de pagamento
    document.getElementById('payment-method').value = 'selecione';
}


// Mostrar mensagem de erro em um pop-up e esconder após 2 segundos
function showErrorPopup(message) {
    const errorMessage = document.getElementById('errorMessage');
    errorMessage.textContent = message;
    errorMessage.classList.remove('d-none');
    
    setTimeout(() => {
        errorMessage.classList.add('d-none');
    }, 2000);
}

// Função para gerar sequência aleatória de 30 caracteres
function generateRandomString(length) {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return result;
}

// Função para gerar QR Code e boleto
function generateQRCode(text) {
    return `<img src="https://api.qrserver.com/v1/create-qr-code/?data=${encodeURIComponent(text)}&size=150x150" alt="QR Code">`;
}

function generateBoleto() {
    const origin = Math.random() < 0.5 ? '0789' : '0790'; 
    const randomNumbers = generateRandomString(9); 

    const boletoCode = `Código de Barras: ${origin}${randomNumbers}`;

    return `
        <p>${boletoCode}</p>
        <button id="download-boleto" class="btn btn-light" onclick="downloadBoleto()">Baixar Boleto</button>
    `;
}


function downloadBoleto() {
    alert('Boleto baixado com sucesso!');
}

function updatePaymentMethod() {
    const paymentMethod = document.getElementById('payment-method').value;

    switch (paymentMethod) {
        case 'pix':
            const pixText = `Pix Copia e Cola: ${generateRandomString(30)}`; // Sequência de 30 caracteres
            const pixQRCode = generateQRCode(pixText);
            document.getElementById('payment-details').innerHTML = `
                <p>Utilize o PIX para pagar com 5% de desconto!</p>
                <p>${pixText}</p>
                ${pixQRCode}
            `;
            break;
        case 'mercado-pago':
            const mercadoPagoQRCode = generateQRCode('Mercado Pago Copia e Cola');
            document.getElementById('payment-details').innerHTML = `
                <p>Use o Mercado Pago para pagar!</p>
                ${mercadoPagoQRCode}
            `;
            break;
        case 'paypal':
            const paypalQRCode = generateQRCode('PayPal Copia e Cola');
            document.getElementById('payment-details').innerHTML = `
                <p>Use o PayPal para pagar!</p>
                ${paypalQRCode}
            `;
            break;
        case 'boleto':
            const boletoHTML = generateBoleto();
            document.getElementById('payment-details').innerHTML = boletoHTML;
            break;
            case 'cartao-credito':
                document.getElementById('payment-details').innerHTML = `
                    <label for="credit-card-name">Nome do Titular:</label>
                    <input type="text" id="credit-card-name"><br>
                    <label for="credit-card-number">Número do Cartão de Crédito:</label>
                    <input type="text" id="credit-card-number"><br>
                    <label for="credit-card-expiry">Data de Validade:</label>
                    <input type="text" id="credit-card-expiry"><br>
                    <label for="credit-card-cvc">CVC:</label>
                    <input type="text" id="credit-card-cvc">
                `;
                break;
            case 'cartao-debito':
                document.getElementById('payment-details').innerHTML = `
                    <label for="debit-card-name">Nome do Titular:</label>
                    <input type="text" id="debit-card-name"><br>
                    <label for="debit-card-number">Número do Cartão de Débito:</label>
                    <input type="text" id="debit-card-number"><br>
                    <label for="debit-card-expiry">Data de Validade:</label>
                    <input type="text" id="debit-card-expiry"><br>
                    <label for="debit-card-cvc">CVC:</label>
                    <input type="text" id="debit-card-cvc">
                `;
                break;
        default:
            document.getElementById('payment-details').innerHTML = '';
            break;
    }

    // Atualizar total se for PIX (com desconto de 5%)
    updateOrderTotal();
}


// Finalizar a compra
function completeOrder() {
    const cep = document.getElementById('cep').value;
    const paymentMethod = document.getElementById('payment-method').value;

    // Verificar se o CEP é válido
    if (!cep || !isValidCEP(cep)) {
        showErrorPopup('Por favor, insira um CEP válido.');
        return;
    }

    // Verificar se há forma de pagamento selecionada
    if (paymentMethod === 'selecione') {
        showErrorPopup('Por favor, selecione uma forma de pagamento.');
        return;
    }

    // Verificar se os detalhes do cartão foram preenchidos corretamente
    if ((paymentMethod === 'cartao-credito' || paymentMethod === 'cartao-debito') && !validateCardDetails()) {
        showErrorPopup('Por favor, insira os dados do cartão corretamente.');
        return;
    }

    // Exibir mensagem de sucesso
    alert('Pedido finalizado com sucesso!');

    // Limpar detalhes do pedido
    clearOrderDetails();

    // Limpar o carrinho e zerar o total
    clearCart();
    subtotal = 0;
}



function clearOrderDetails() {
    document.getElementById('cep').value = '';
    document.getElementById('successMessage').classList.add('d-none');
    document.getElementById('errorMessage').classList.add('d-none');
    toggleOrderPopup();
    document.getElementById('shipping-cost').innerText = 'Frete: R$ 0,00';
    shippingCost = 0;
    updateOrderTotal();
    document.getElementById('payment-details').innerHTML = '';

    // Resetar para a opção "Selecione" no método de pagamento
    document.getElementById('payment-method').value = 'selecione';
}



// Método para abrir/fechar o pop-up de pedido
function toggleOrderPopup() {
    document.getElementById('order-popup').classList.toggle('open');
}

// Métodos de pagamento
document.getElementById('payment-method').addEventListener('change', updatePaymentMethod);

// Função para calcular o frete e atualizar o total
document.getElementById('btn-calculate-shipping').addEventListener('click', () => {
    const cep = document.getElementById('cep').value;
    if (!cep || !isValidCEP(cep)) {
        showErrorPopup('Por favor, insira um CEP válido para calcular o frete.');
        return;
    }

    // Simular cálculo de frete aleatório entre R$ 0 e R$ 50
    shippingCost = subtotal >= 150 ? 0 : Math.floor(Math.random() * 51);
    document.getElementById('shipping-cost').innerText = `Frete: R$ ${shippingCost.toFixed(2)}`;
    updateOrderTotal();
});

function isValidCEP(cep) {
    const cepPattern = /^[0-9]{5}-[0-9]{3}$/;
    return cepPattern.test(cep);
}

// Adicionar lógica para validar os detalhes do cartão de crédito/débito
function validateCardDetails() {
    const paymentMethod = document.getElementById('payment-method').value;

    if (paymentMethod === 'cartao-credito') {
        const creditCardNumber = document.getElementById('credit-card-number').value;
        const creditCardExpiry = document.getElementById('credit-card-expiry').value;
        const creditCardCVC = document.getElementById('credit-card-cvc').value;

        // Simples validação para exemplo: verificar se estão preenchidos
        if (creditCardNumber && creditCardExpiry && creditCardCVC) {
            return true;
        }
    } else if (paymentMethod === 'cartao-debito') {
        const debitCardNumber = document.getElementById('debit-card-number').value;
        const debitCardExpiry = document.getElementById('debit-card-expiry').value;
        const debitCardCVC = document.getElementById('debit-card-cvc').value;

        // Simples validação para exemplo: verificar se estão preenchidos
        if (debitCardNumber && debitCardExpiry && debitCardCVC) {
            return true;
        }
    }

    return false;
}

// Adicionar lógica para calcular o total quando o subtotal ou frete forem alterados
function updateOrderTotal() {
    let total = subtotal + shippingCost;
    const paymentMethod = document.getElementById('payment-method').value;
    
    if (paymentMethod === 'pix') {
        const discount = subtotal * 0.05;
        total -= discount;
    }
    
    document.getElementById('order-total').innerText = `Total: R$ ${total.toFixed(2)}`;
}

document.querySelectorAll('.btn-warning').forEach((button) => {
    button.addEventListener('click', (event) => {
        event.preventDefault();
        const productCard = event.target.closest('.card-body');
        const title = productCard.querySelector('.card-title').innerText;
        const price = parseFloat(productCard.querySelector('.card-price').innerText.replace('R$', '').trim());
        const image = productCard.closest('.card').querySelector('img').src;
        addToCart({ title, price, image });
    });
});

document.addEventListener('DOMContentLoaded', () => {
    renderCartItems();
    updateCartCount();
});
