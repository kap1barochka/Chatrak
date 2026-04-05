// --- ЛОГИКА НАВИГАЦИИ (От Chatrak) ---
let menu = document.querySelector('#menu-btn');
let navbar = document.querySelector('.navbar');

menu.onclick = () => {
    menu.classList.toggle('fa-times');
    navbar.classList.toggle('active');
};

window.onscroll = () => {
    menu.classList.remove('fa-times');
    navbar.classList.remove('active');
};

// --- ЛОГИКА МАГАЗИНА И КОРЗИНЫ (От HRealm) ---
let cart = [];

// Инициализация карточек товаров
const cards = document.querySelectorAll('.store-box');

cards.forEach(card => {
    const name = card.getAttribute('data-name');
    const price = parseFloat(card.getAttribute('data-price'));
    const desc = card.getAttribute('data-desc');
    const img = card.querySelector('img').src;

    // Открытие модального окна деталей при клике на карточку
    card.onclick = () => {
        openDetails({ name, price, desc, img });
    };

    // Добавление в корзину при клике на кнопку
    const btn = card.querySelector('.buy-btn');
    btn.onclick = (e) => {
        e.stopPropagation(); // Чтобы не открывались детали
        add({ name, price });
    };
});

function openDetails(item) {
    document.getElementById('det-img').src = item.img;
    document.getElementById('det-title').innerText = item.name;
    document.getElementById('det-desc').innerText = item.desc;
    
    const amd = (item.price * 400).toLocaleString();
    const eur = (item.price * 0.92).toFixed(2);
    
    document.getElementById('det-prices').innerHTML = `
        <p style="margin-bottom: .5rem;">USD: $${item.price}</p>
        <p style="margin-bottom: .5rem;">EUR: €${eur}</p>
        <p>AMD: ֏${amd}</p>
    `;
    
    document.getElementById('det-buy-trigger').onclick = () => { 
        add(item); 
        closeDetails(); 
    };
    document.getElementById('details-modal').style.display = 'block';
}

function closeDetails() { 
    document.getElementById('details-modal').style.display = 'none'; 
}

function add(item) {
    cart.push(item);
    document.getElementById('count').innerText = cart.length;
}

function openCart() {
    const list = document.getElementById('cart-list');
    list.innerHTML = '';
    let total = 0;
    
    if(cart.length === 0) {
        list.innerHTML = '<p style="font-size: 1.6rem; color: #666; text-align: center;">Your basket is empty.</p>';
    } else {
        // Мы добавили слово 'index', чтобы скрипт знал порядковый номер товара
        cart.forEach((i, index) => {
            total += i.price;
            list.innerHTML += `
                <div style="display:flex; justify-content:space-between; align-items:center; padding:1.5rem 0; border-bottom:.1rem solid #eee;">
                    <span style="flex: 1; font-size: 1.6rem;">${i.name}</span>
                    <strong style="margin-right: 1.5rem; font-size: 1.6rem;">$${i.price}</strong>
                    <!-- А вот и сам крестик для удаления конкретного товара -->
                    <i class="fas fa-times" style="color: #90260e; cursor: pointer; font-size: 2rem; transition: 0.2s;" onclick="removeItem(${index})" onmouseover="this.style.transform='scale(1.2)'" onmouseout="this.style.transform='scale(1)'"></i>
                </div>`;
        });
    }
    
    document.getElementById('cart-sum').innerHTML = `<h3 style="text-align:right; margin-top:2rem;">Total:$${total}</h3>`;
    document.getElementById('cart-modal').style.display = 'block';
}

// НОВАЯ ФУНКЦИЯ: Она берет номер товара (index) и удаляет его из корзины
function removeItem(index) {
    cart.splice(index, 1); // Вычеркиваем товар из нашего массива cart
    document.getElementById('count').innerText = cart.length; // Обновляем красную цифру в шапке сайта
    openCart(); // Перерисовываем корзину, чтобы товар сразу исчез с экрана
}

function closeCart() {
    document.getElementById('cart-modal').style.display = 'none';
    document.getElementById('checkout-section').style.display = 'none';
    document.getElementById('go-check').style.display = 'block';
    document.getElementById('fill').style.width = '0';
}

function startCheck() {
    if(cart.length === 0) return alert("Basket is empty!");
    document.getElementById('go-check').style.display = 'none';
    document.getElementById('checkout-section').style.display = 'block';
    // Небольшая анимация прогресс-бара
    setTimeout(() => { document.getElementById('fill').style.width = '20%'; }, 100);
}

function finish() {
    const a = document.getElementById('ship-addr').value;
    const c = document.getElementById('cvv-code').value;
    
    if(a && c.length === 3) {
        document.getElementById('fill').style.width = '100%';
        setTimeout(() => {
            alert("Success! Order placed for: " + a);
            cart = [];
            document.getElementById('count').innerText = 0;
            document.getElementById('ship-addr').value = '';
            document.getElementById('cvv-code').value = '';
            closeCart();
        }, 600);
    } else {
        alert("Please enter a valid address and a 3-digit CVV.");
    }
}
























// --- ФИЛЬТР КАТЕГОРИЙ (ВИЗУАЛЬНАЯ СЕТКА) ---
document.addEventListener("DOMContentLoaded", () => {
    const catBoxes = document.querySelectorAll('.cat-box');
    const storeBoxes = document.querySelectorAll('.store-box');

    if (catBoxes.length > 0 && storeBoxes.length > 0) {
        
        // 1. Создаем функцию, которая скрывает/показывает товары
        function filterItems(filterValue) {
            storeBoxes.forEach(item => {
                if (filterValue === 'all' || item.getAttribute('data-category') === filterValue) {
                    item.style.display = 'block'; // Показываем
                    item.style.animation = 'fadeIn 0.5s ease-in-out'; // Добавляем плавность
                } else {
                    item.style.display = 'none'; // Скрываем
                }
            });
        }

        // 2. Вешаем эту функцию на клики по категориям
        catBoxes.forEach(box => {
            box.onclick = () => {
                // Убираем рамку со всех и добавляем на нажатую
                catBoxes.forEach(b => b.classList.remove('active'));
                box.classList.add('active');
                
                // Запускаем фильтр
                filterItems(box.getAttribute('data-filter'));
            };
        });

        // 3. САМОЕ ГЛАВНОЕ: СРАЗУ фильтруем товары при обновлении страницы
        // Берем data-filter у первой кнопки (например, "pieces")
        const firstCategory = catBoxes[0].getAttribute('data-filter');
        catBoxes.forEach(b => b.classList.remove('active'));
        catBoxes[0].classList.add('active');
        
        // Запускаем скрытие лишних товаров моментально
        filterItems(firstCategory);
    }
});