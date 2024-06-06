let cart = [];

    function addToCart(item) {
        cart.push(item);
        updateCartCount();
        renderCartItems();
    }

    function updateCartCount() {
        document.getElementById('cart-count').innerText = cart.length;
    }

    function toggleCart() {
        document.getElementById('cart-sidebar').classList.toggle('open');
    }

    function clearCart() {
        cart = [];
        updateCartCount();
        renderCartItems();
    }

    function finalizePurchase() {
        if (cart.length === 0) {
            alert('Nada foi encontrado');
        } else {
            alert('Compra finalizada!');
            clearCart();
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
                    <p>${item.title} - ${item.size}</p>
                    <button class="btn btn-danger btn-sm" onclick="removeCartItem(${index})">Remover</button>
                `;
                cartItemsContainer.appendChild(itemElement);
            });
        }
    }

    function removeCartItem(index) {
        cart.splice(index, 1);
        updateCartCount();
        renderCartItems();
    }

    document.querySelectorAll('.btn-warning').forEach((button, index) => {
        button.addEventListener('click', (event) => {
            event.preventDefault();
            const productCard = event.target.closest('.card-body');
            const title = productCard.querySelector('.card-title').innerText;
            const size = 'M'; 
            addToCart({ title, size });
        });
    });