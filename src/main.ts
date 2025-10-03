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
import { Basket } from './components/View/Basket';
import { OrderForm } from './components/View/forms/OrderForm';
import { ContactsForm } from './components/View/forms/ContactsForm';
import { CardCatalog } from './components/View/cards/CardCatalog';
import { CardPreview } from './components/View/cards/CardPreview';
import { Success } from './components/View/Success';

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
const tplCardCatalog   = ensureElement<HTMLTemplateElement>('#card-catalog');
const tplCardPreview   = ensureElement<HTMLTemplateElement>('#card-preview');
const tplBasket        = ensureElement<HTMLTemplateElement>('#basket');
const tplBasketItem    = ensureElement<HTMLTemplateElement>('#card-basket');
const tplOrder         = ensureElement<HTMLTemplateElement>('#order');
const tplContacts      = ensureElement<HTMLTemplateElement>('#contacts');
const tplSuccess       = ensureElement<HTMLTemplateElement>('#success');

// локальные ссылки на View, чтобы обновлять их при событиях модели
let basketView: Basket | null = null;

// стартовое состояние счётчика корзины
header.counter = cartModel.getCount();

// ХЕЛПЕРЫ РЕНДЕРА

function renderCatalog() {
  const items = productsModel.getItems();
  const nodes = items.map((p) => {
    const card = new CardCatalog(cloneTemplate(tplCardCatalog));
    const el = card.render({
      title: p.title,
      image: p.image,
      category: p.category,
    });
    // Выбор карточки - просто сохраняем currentProduct в модели
    el.addEventListener('click', () => productsModel.setCurrentProduct(p));
    return el;
  });
  gallery.render({ catalog: nodes });
}

function renderBasket() {
  if (!basketView) return;
  const items = cartModel.getItems();
  const itemNodes = items.map((p, i) =>
    Basket.createItem(events, tplBasketItem, p, i + 1)
  );
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
  basketView = new Basket(events, cloneTemplate(tplBasket));
  modal.open(basketView.render());
  renderBasket();
}

function openOrderStep1() {
  const form = new OrderForm(events, cloneTemplate(tplOrder));
  const buyer = buyerModel.getData();
  form.payment = buyer.payment;
  form.addressValue = buyer.address;
  modal.open(form.render());
}

function openOrderStep2() {
  const form = new ContactsForm(events, cloneTemplate(tplContacts));
  const buyer = buyerModel.getData();
  form.emailValue = buyer.email;
  form.phoneValue = buyer.phone;
  modal.open(form.render());
}

function openSuccess(total: number) {
  const success = new Success(events, cloneTemplate(tplSuccess));
  const node = success.render({ total });
  modal.open(node);
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


// ОБРАБОТЧИКИ СОБЫТИЙ ПРЕДСТАВЛЕНИЙ

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

// После действия в превью (купить/удалить) - закрыть модалку
events.on('preview:acted', () => modal.close());

// Корзина: перейти к оформлению
events.on('order:open', () => openOrderStep1());

// Форма шага 1 - сохранить способ оплаты и адрес, открыть шаг 2
events.on<{ payment: 'card' | 'cash'; address: string }>(
  'order:submit-step1',
  ({ payment, address }) => {
    buyerModel.setPayment(payment);
    buyerModel.setAddress(address);
    openOrderStep2();
  }
);

// Форма шага 2 - сохранить контакты, отправить заказ
events.on<{ email: string; phone: string }>(
  'order:submit-step2',
  async ({ email, phone }) => {
    buyerModel.setEmail(email);
    buyerModel.setPhone(phone);

    const items = cartModel.getItems().map((p) => p.id);
    const buyer = buyerModel.getData();
    const total = cartModel.getTotalAmount();

    try {
      await api.submitOrder({ items, buyer, total } as any);
      cartModel.clear();
      buyerModel.clear();
      openSuccess(total);
    } catch (e) {
      console.error('Ошибка при оформлении заказа:', e);
    }
  }
);

// Закрытие модалки: сбрасываем ссылку на корзину
events.on('modal:close', () => {
  basketView = null;
});

// Успешный экран: по кнопке - просто закрыть модалку
events.on('success:close', () => modal.close());

// ЗАГРУЗКА КАТАЛОГА
api
  .fetchProducts()
  .then((items) => productsModel.setItems(items))
  .catch((e) => console.error('Ошибка загрузки каталога:', e));
