# Проектная работа "Веб-ларек"

Стек: HTML, SCSS, TS, Vite

Структура проекта:
- src/ — исходные файлы проекта
- src/components/ — папка с JS компонентами
- src/components/base/ — папка с базовым кодом

Важные файлы:
- index.html — HTML-файл главной страницы
- src/types/index.ts — файл с типами
- src/main.ts — точка входа приложения
- src/scss/styles.scss — корневой файл стилей
- src/utils/constants.ts — файл с константами
- src/utils/utils.ts — файл с утилитами

## Установка и запуск
Для установки и запуска проекта необходимо выполнить команды

```
npm install
npm run start
```

или

```
yarn
yarn start
```
## Сборка

```
npm run build
```

или

```
yarn build
```
# Интернет-магазин «Web-Larёk»
«Web-Larёk» — это интернет-магазин с товарами для веб-разработчиков, где пользователи могут просматривать товары, добавлять их в корзину и оформлять заказы. Сайт предоставляет удобный интерфейс с модальными окнами для просмотра деталей товаров, управления корзиной и выбора способа оплаты, обеспечивая полный цикл покупки с отправкой заказов на сервер.

## Архитектура приложения

Код приложения разделен на слои согласно парадигме MVP (Model-View-Presenter), которая обеспечивает четкое разделение ответственности между классами слоев Model и View. Каждый слой несет свой смысл и ответственность:

Model - слой данных, отвечает за хранение и изменение данных.  
View - слой представления, отвечает за отображение данных на странице.  
Presenter - презентер содержит основную логику приложения и  отвечает за связь представления и данных.

Взаимодействие между классами обеспечивается использованием событийно-ориентированного подхода. Модели и Представления генерируют события при изменении данных или взаимодействии пользователя с приложением, а Презентер обрабатывает эти события используя методы как Моделей, так и Представлений.

### Базовый код

#### Класс Component
Является базовым классом для всех компонентов интерфейса.
Класс является дженериком и принимает в переменной `T` тип данных, которые могут быть переданы в метод `render` для отображения.

Конструктор:  
`constructor(container: HTMLElement)` - принимает ссылку на DOM элемент за отображение, которого он отвечает.

Поля класса:  
`container: HTMLElement` - поле для хранения корневого DOM элемента компонента.

Методы класса:  
`render(data?: Partial<T>): HTMLElement` - Главный метод класса. Он принимает данные, которые необходимо отобразить в интерфейсе, записывает эти данные в поля класса и возвращает ссылку на DOM-элемент. Предполагается, что в классах, которые будут наследоваться от `Component` будут реализованы сеттеры для полей с данными, которые будут вызываться в момент вызова `render` и записывать данные в необходимые DOM элементы.  
`setImage(element: HTMLImageElement, src: string, alt?: string): void` - утилитарный метод для модификации DOM-элементов `<img>`.

#### Класс Api
Содержит в себе базовую логику отправки запросов.

Конструктор:  
`constructor(baseUrl: string, options: RequestInit = {})` - В конструктор передается базовый адрес сервера и опциональный объект с заголовками запросов.

Поля класса:  
`baseUrl: string` - базовый адрес сервера.  
`options: RequestInit` - объект с заголовками, которые будут использованы для запросов.

Методы класса:  
`get(uri: string): Promise<object>` - выполняет GET запрос на переданный в параметрах ендпоинт и возвращает промис с объектом, которым ответил сервер  
`post(uri: string, data: object, method: ApiPostMethods = 'POST'): Promise<object>` - принимает объект с данными, которые будут переданы в JSON в теле запроса, и отправляет эти данные на ендпоинт переданный как параметр при вызове метода. По умолчанию выполняется `POST` запрос, но метод запроса может быть переопределен заданием третьего параметра при вызове.  
`handleResponse(response: Response): Promise<object>` - защищенный метод проверяющий ответ сервера на корректность и возвращающий объект с данными полученный от сервера или отклоненный промис, в случае некорректных данных.

#### Класс EventEmitter
Брокер событий реализует паттерн "Наблюдатель", позволяющий отправлять события и подписываться на события, происходящие в системе. Класс используется для связи слоя данных и представления.

Конструктор класса не принимает параметров.

Поля класса:  
`_events: Map<string | RegExp, Set<Function>>)` -  хранит коллекцию подписок на события. Ключи коллекции - названия событий или регулярное выражение, значения - коллекция функций обработчиков, которые будут вызваны при срабатывании события.

Методы класса:  
`on<T extends object>(event: EventName, callback: (data: T) => void): void` - подписка на событие, принимает название события и функцию обработчик.  
`emit<T extends object>(event: string, data?: T): void` - инициализация события. При вызове события в метод передается название события и объект с данными, который будет использован как аргумент для вызова обработчика.  
`trigger<T extends object>(event: string, context?: Partial<T>): (data: T) => void` - возвращает функцию, при вызове которой инициализируется требуемое в параметрах событие с передачей в него данных из второго параметра.

### Данные

#### Интерфейс IProduct
Описывает товар в каталоге
```
export interface IProduct {
  id: string;
  description: string;
  image: string;
  title: string;
  category: string;
  price: number | null;
}
```

#### Интерфейс IBuyer
Хранит данные покупателя, которые указываются при оформлении заказа
```
export interface IBuyer {
  payment: TPayment;
  email: string;
  phone: string;
  address: string;
}
```

#### Интерфейс IProductsResponse
Структура ответа сервера при получении каталога товаров
```
export interface IProductsResponse {
  total: number;
  items: IProduct[];
}
```

#### Интерфейс IOrderRequest
Структура данных заказа, отправляемых на сервер
```
export interface IOrderRequest {
  items: string[];
  buyer: IBuyer;
}
```

#### Интерфейс IOrderResponse
Ответ сервера после успешного создания заказа
```
export interface IOrderResponse {
  id: string;
  total?: number;
}
```

### Модели данных
Модели данных отвечают только за хранение и работу с данными. Они не связаны с отображением и не используют DOM.

#### Класс Products
Хранит массив всех товаров и выбранный для подробного просмотра товар.

Конструктор класса не принимает параметров.

Поля класса:  
`products: IProduct[]` - массив всех товаров каталога.  
`currentProduct: IProduct | null` - выбранный товар.

Методы класса:  
`setItems(items: IProduct[]): void` - сохраняет массив товаров.  
`getItems(): IProduct[]` - возвращает массив всех товаров.  
`getProductById(id: string): IProduct | undefined` - возвращает товар по его id.  
`setCurrentProduct(product: IProduct): void` - сохраняет выбранный товар.  
`getCurrentProduct(): IProduct | null` - возвращает выбранный товар.

#### Класс Cart
Хранит массив товаров, добавленных в корзину.

Конструктор класса не принимает параметров.

Поля класса:  
`items: IProduct[]` - товары, выбранные для покупки.

Методы класса:  
`getItems(): IProduct[]` - возвращает все товары в корзине.  
`addItem(product: IProduct): void` - добавляет товар в корзину.  
`removeItem(product: IProduct): void` - удаляет товар из корзины.  
`clear(): void` - очищает корзину.  
`getTotalAmount(): number` - возвращает общую стоимость товаров.  
`getCount(): number` - возвращает количество товаров в корзине.  
`hasItem(id: string): boolean` - проверяет, есть ли товар в корзине по id.

#### Класс Buyer
Хранит данные покупателя при оформлении заказа.

Конструктор класса не принимает параметров.

Поля класса:  
`payment: TPayment` - способ оплаты.  
`email: string` - адрес электронной почты.  
`phone: string` - телефон.  
`address: string` - адрес доставки.

Методы класса:  
`setData(data: IBuyer): void` - сохраняет все данные покупателя.  
`setPayment(v: TPayment): void` - задаёт способ оплаты.  
`setEmail(v: string): void` - задаёт email.  
`setPhone(v: string): void` - задаёт телефон.  
`setAddress(v: string): void` - задаёт адрес доставки.  
`getData(): IBuyer` - возвращает все данные покупателя.  
`clear(): void` - очищает данные.  
`validate(): { errors: Partial<Record<'email' | 'phone' | 'address' | 'payment', string>>; isValid: boolean }` - проверяет корректность каждого поля.

### Слой коммуникации

#### Класс WeblarekApi
Отвечает за работу с сервером, выполняет запросы для получения списка товаров и отправки заказов. Использует композицию с базовым классом Api.

Конструктор:  
`constructor(api: IApi)` - принимает объект, реализующий интерфейс IApi.

У класса нет собственных полей.

Методы класса:  
`fetchProducts(): Promise<IProduct[]>` - выполняет GET /product/ и возвращает массив товаров.  
`submitOrder(payload: IOrderRequest): Promise<IOrderResponse>` - выполняет POST /order/ и отправляет данные заказа на сервер.

### Слой представления

#### Класс Header
Отвечает за область шапки: кнопка корзины и счётчик товаров.

Конструктор:  
`constructor(events: IEvents, container: HTMLElement)`

Поля класса:  
`counterElement: HTMLElement` - узел счётчика .header__basket-counter.  
`basketButton: HTMLButtonElement` - кнопка корзины .header__basket.

Методы класса:  
`set counter(value: number)` - обновляет счётчик.

#### Класс Gallery

Конструктор: 
`constructor(container = ensureElement('main.gallery'))` - по умолчанию находит корневой контейнер.

Поля класса:  
`catalogElement: HTMLElement` - корневой контейнер.

Методы класса:  
`set catalog(items: HTMLElement[])` - заменяет содержимое каталога на переданные элементы.

#### Базовый класс карточек CardBase<T>
Общий предок для всех карточек (каталог, превью, позиция корзины). Инкапсулирует общие сеттеры: title, price, image (через setImage), а также базовые обработчики клика.

#### Класс CardCatalog
Карточка в сетке каталога (кнопка/плитка): категория, изображение, заголовок.

Конструктор:  
`constructor(container: HTMLElement)`

Поля класса:  
`.card__category` - категория.  
`.card__image` - изображение.  
`.card__title` - заголовок.

Методы класса:  
`set title(value: string)` - записывает заголовок.  
`set category(value: string)` - текст категории + переключение CSS-модификаторов по categoryMap.  
`set image(value: string)` - устанавливает src (через CDN_URL) и alt из заголовка.

#### Класс CardPreview
Полноразмерная карточка товара для модального окна.

Конструктор:  
`constructor(events: IEvents, container: HTMLElement)`

Поля класса:  
`.card__image` - изображение.  
`.card__category` - категория.  
`.card__title` - заголовок.  
`.card__text` - описание.  
`.card__price` - цена.  
`.card__button` - кнопка "В корзину" / "Удалить из корзины".

Методы класса:  
`set image(value: string)` - проставляет src (через CDN) и alt.  
`set category(value: string)` - текст + модификатор по categoryMap.  
`set title(value: string)` - записывает заголовок.  
`set description(value: string)` - записывает описание.  
`set price(value: number | null)` — устанавливает цену.  
`set inCart(value: boolean)` - меняет текст кнопки на "Удалить из корзины", если товар уже в корзине.

#### Класс BasketItem
Строка товара в корзине: порядковый номер, название, цена, кнопка удаления.

Конструктор:  
`constructor(events: IEvents, container: HTMLElement)`

Поля класса:  
`.basket__item-index` - индекс.  
`.card__title` - заголовок.  
`.card__price` - цена.  
`.basket__item-delete` - удалить.

Методы класса:  
`set id(v: string)` - сохраняет идентификатор для удаления.  
`set index(v: number)` - отображает порядковый номер.  
`set title(v: string)` - отображает заголовок.  
`set price(v: number | null)` - отображает цену.

#### Класс Basket
Контент корзины: список позиций, сумма, кнопка "Оформить".

Конструктор:  
`constructor(events: IEvents, container: HTMLElement)`

Поля класса:  
`.basket__list` - список.  
`.basket__price` - сумма.  
`.basket__button` - оформить.

Методы класса:  
`set items(els: HTMLElement[])` - если список пуст, показывает "Корзина пуста" и блокирует кнопку. Иначе - рендерит элементы и разблокирует.  
`set total(v: number)` - отображает сумму в синапсах.  
`static createItem(events, tpl, product, index)` - фабрика BasketItem из шаблона #card-basket.

#### Класс Modal
Универсальное модальное окно. Само по себе не имеет наследников — внутрь вставляются самостоятельные компоненты (корзина, превью, формы и т.д.).

Конструктор:  
`constructor(events: IEvents, container = ensureElement('#modal-container'))` - ищет внутри контейнера .modal__content, .modal__close, .modal__container.  

Поля класса:  
`content: HTMLElement` - контейнер содержимого.  
`closeButton: HTMLButtonElement` - кнопка закрытия.  
`inner: HTMLElement` - внутренний элемент модального окна.

Методы класса:  
`open(content: HTMLElement)` - вставляет содержимое, добавляет класс показа modal_active и блокирует скролл body.  
`close()` - убирает класс, очищает содержимое, снимает блокировку скролла и эмитит modal:close.

#### Базовый класс форм FormBase<T>
Общий предок для форм. Содержит поиск `.form__errors`, общий `set errors(text)` и `set canSubmit(flag)` + метод `updateValidity()`.

#### Класс OrderForm
Способ оплаты и адрес доставки.

Конструктор:  
`constructor(events: IEvents, container: HTMLElement)` - ищет в контейнере: form[name="order"], input[name="address"], .form__errors, .order__button, button[name="card"], button[name="cash"].

Поля класса:  
`form`, `address`, `errors`, `nextBtn`, `btnCard`, `btnCash`, `payment`.

Методы класса:  
`set payment(...)`, `set addressValue(...)`, `updateValidity()`.

#### Класс ContactsForm 
Поля контактов: email и телефон.

Конструктор:  
`constructor(events: IEvents, container: HTMLElement)` - ищет: form[name="contacts"], input[name="email"], input[name="phone"], .form__errors, button[type="submit"].

Поля класса:  
`form`, `email`, `phone`, `errors`, `payBtn`.

Методы класса:  
`set emailValue(...)`, `set phoneValue(...)`, `updateValidity()`.

#### Класс Success
Экран успешной оплаты.

Конструктор:  
`constructor(events: IEvents, container: HTMLElement)` - узлы: .order-success__title, .order-success__description, .order-success__close.

Поля класса:  
`titleEl`, `descEl`, `closeBtn`.

Методы класса:  
`set total(value: number)` - выводит "Списано N синапсов".

## События приложения

### Презентер
Подписывается на события моделей и представлений, открывает/закрывает модальные экраны и инициирует рендеры. Сам событий не генерирует. Перерисовки выполняются только на событиях моделей данных и при открытии модальных окон.

#### Модели
- `products:changed` - перерисовать каталог.  
- `product:current-changed` - открыть превью выбранного товара.  
- `cart:changed` - обновить счётчик в шапке и содержимое корзины.  
- `buyer:changed` - (рендер не требуется, формы валидируются локально).  

#### Представления
- `basket:open` - открыть корзину.  
- `cart:add { id }` - добавить товар в корзину.  
- `cart:remove { id }` - удалить товар из корзины.  
- `order:open` - открыть оформление.  
- `order:submit-step1 { payment, address }` - сохранить данные и открыть шаг 2.  
- `order:submit-step2 { email, phone }` - отправить заказ, при успехе очистить корзину/данные покупателя и открыть экран "успеха".  
- `preview:acted` - закрыть превью.  
- `modal:close` - сброс локальных ссылок.  
- `success:close` - закрыть модальное окно "успеха".
