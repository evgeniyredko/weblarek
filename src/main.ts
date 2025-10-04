import './scss/styles.scss';

// utils
import { ensureElement, cloneTemplate } from './utils/utils';
import { API_URL } from './utils/constants';

// базовый API и сервис
import { Api } from './components/base/Api';
import WeblarekApi from './components/Services/WeblarekApi';

// брокер событий
import { EventEmitter } from './components/base/Events';

// Модели
import Products from './components/Models/Products';
import Cart from './components/Models/Cart';
import Buyer from './components/Models/Buyer';

// Представления
import { Header } from './components/View/Header';
import { Gallery } from './components/View/Gallery';
import { Modal } from './components/View/Modal';
import { Basket, BasketItem } from './components/View/Basket';
import { OrderForm } from './components/View/forms/OrderForm';
import { ContactsForm } from './components/View/forms/ContactsForm';
import { CardCatalog } from './components/View/cards/CardCatalog';
import { CardPreview } from './components/View/cards/CardPreview';
import { Success } from './components/View/Success';

import type { IBuyer, IOrderRequestWithTotal } from './types';

// ИНИЦИАЛИЗАЦИЯ

const events = new EventEmitter();
const http = new Api(API_URL);
const api = new WeblarekApi(http);

const productsModel = new Products();
const cartModel = new Cart();
const buyerModel = new Buyer();

// View
const header = new Header(events, ensureElement<HTMLElement>('header.header'));
const gallery = new Gallery();
const modal = new Modal(events);

// templates
const tplCardCatalog = ensureElement<HTMLTemplateElement>('#card-catalog');
const tplCardPreview = ensureElement<HTMLTemplateElement>('#card-preview');
const tplBasket = ensureElement<HTMLTemplateElement>('#basket');
const tplBasketItem = ensureElement<HTMLTemplateElement>('#card-basket');
const tplOrder = ensureElement<HTMLTemplateElement>('#order');
const tplContacts = ensureElement<HTMLTemplateElement>('#contacts');
const tplSuccess = ensureElement<HTMLTemplateElement>('#success');

const basketView = new Basket(events, cloneTemplate(tplBasket));
const orderFormView = new OrderForm(events, cloneTemplate(tplOrder));
const contactsFormView = new ContactsForm(events, cloneTemplate(tplContacts));
const successView = new Success(events, cloneTemplate(tplSuccess));

// стартовое состояние счётчика корзины
header.counter = cartModel.getCount();
renderBasket(); // чтобы кнопка "Оформить" была недоступна у пустой корзины

// ХЕЛПЕРЫ РЕНДЕРА

function renderCatalog() {
  const items = productsModel.getItems();
  const nodes = items.map((p) => {
    const card = new CardCatalog(events, cloneTemplate(tplCardCatalog));
    return card.render({
      id: p.id,
      title: p.title,
      image: p.image,
      category: p.category,
      price: p.price,
    });
  });
  gallery.render({ catalog: nodes });
}

function renderBasket() {
  const items = cartModel.getItems();
  const itemNodes = items.map((p, i) => {
    const item = new BasketItem(events, cloneTemplate(tplBasketItem));
    item.index = i + 1;
    return item.render({ id: p.id, title: p.title, price: p.price });
  });
  basketView.items = itemNodes;
  basketView.total = cartModel.getTotalAmount();
}


function openPreview(productId: string) {
  const product = productsModel.getProductById(productId);
  if (!product) return;
  const preview = new CardPreview(events, cloneTemplate(tplCardPreview));
  const node = preview.render({
    ...product,
    inCart: cartModel.hasItem(product.id),
  });
  modal.open(node);
}

function openBasket() {
  modal.open(basketView.render());
}

function openOrderStep1() {
  const buyer = buyerModel.getData();
  orderFormView.payment = buyer.payment;
  orderFormView.addressValue = buyer.address;
  modal.open(orderFormView.render());
}

function openOrderStep2() {
  const buyer = buyerModel.getData();
  contactsFormView.emailValue = buyer.email;
  contactsFormView.phoneValue = buyer.phone;
  modal.open(contactsFormView.render());
}

function openSuccess(total: number) {
  modal.open(successView.render({ total }));
}

// ОБРАБОТЧИКИ СОБЫТИЙ МОДЕЛЕЙ

// Каталог обновился - перерисовать сетку
productsModel.on<{ items: unknown }>('products:changed', () => renderCatalog());

// Выбран текущий товар → открыть превью
productsModel.on<{ product: { id: string } | null }>(
  'product:current-changed',
  ({ product }) => {
    if (product?.id) openPreview(product.id);
  }
);

// Корзина изменилась - обновить счётчик и если открыта корзина её содержимое
cartModel.on<{ count: number }>('cart:changed', ({ count }) => {
  header.counter = count;
  renderBasket();
});

// Данные покупателя изменились — синхронизируем поля обеих форм
buyerModel.on<IBuyer>('buyer:changed', (data) => {
  // шаг 1: способ оплаты и адрес
  orderFormView.payment = data.payment;
  orderFormView.addressValue = data.address;

  // шаг 2: email и телефон
  contactsFormView.emailValue = data.email;
  contactsFormView.phoneValue = data.phone;
});

// Результаты валидации — показываем ошибки и включаем/выключаем кнопки
buyerModel.on<{ 
  errors: Partial<Record<'email' | 'phone' | 'address' | 'payment', string>>; 
  isValid: boolean 
}>('form:validate', ({ errors }) => {
  // Валидность шага 1 — нет ошибок по адресу и оплате
  const step1Valid = !errors.address && !errors.payment;
  orderFormView.canSubmit = step1Valid;
  orderFormView.errorsEl = errors.address || errors.payment || '';

  // Валидность шага 2 — нет ошибок по email и телефону
  const step2Valid = !errors.email && !errors.phone;
  contactsFormView.canSubmit = step2Valid;
  contactsFormView.errorsEl = errors.email || errors.phone || '';
});


// ОБРАБОТЧИКИ СОБЫТИЙ ПРЕДСТАВЛЕНИЙ

// Каталог: клик по карточке - выбрать товар
events.on<{ id: string }>('card:select', ({ id }) => {
  const product = productsModel.getProductById(id);
  if (product) productsModel.setCurrentProduct(product);
});

// Header: открытие корзины
events.on('basket:open', () => openBasket());

// Кнопка в превью: добавить/удалить
events.on<{ id: string }>('cart:add', ({ id }) => {
  const product = productsModel.getProductById(id);
  if (product) cartModel.addItem(product);
});

events.on<{ id: string }>('cart:remove', ({ id }) => {
  const product = productsModel.getProductById(id);
  if (product) cartModel.removeItem(product);
});

// Корзина: перейти к оформлению
events.on('order:open', () => openOrderStep1());

events.on('order:submit-step1', () => openOrderStep2());

events.on('order:submit-step2', async () => {
  const items = cartModel.getItems().map((p) => p.id);
  const buyer = buyerModel.getData();
  const total = cartModel.getTotalAmount();
  const order: IOrderRequestWithTotal = { items, buyer, total };
  try {
    await api.submitOrder(order);
    cartModel.clear();
    buyerModel.clear();
    openSuccess(total);
  } catch (e) {
    console.error('Ошибка при оформлении заказа:', e);
  }
});

events.on<{ field: 'payment'|'address'|'email'|'phone'; value: string }>('order:change', ({ field, value }) => {
  switch (field) {
    case 'payment': buyerModel.setPayment(value as 'card'|'cash'); break;
    case 'address': buyerModel.setAddress(value); break;
    case 'email':   buyerModel.setEmail(value); break;
    case 'phone':   buyerModel.setPhone(value); break;
  }
});

// Закрытие модалки
events.on('preview:close', () => modal.close());

// Успешный экран - закрыть модалку
events.on('success:close', () => modal.close());

// ЗАГРУЗКА КАТАЛОГА
api
  .fetchProducts()
  .then((items) => productsModel.setItems(items))
  .catch((e) => console.error('Ошибка загрузки каталога:', e));
