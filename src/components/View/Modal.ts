import { ensureElement } from '../../utils/utils';
import { Component } from '../base/Component';
import type { IEvents } from '../base/Events';

interface IModal { content: HTMLElement }

export class Modal extends Component<IModal> {
  protected content: HTMLElement;
  protected closeButton: HTMLButtonElement;
  protected inner: HTMLElement;

  constructor(protected events: IEvents, container: HTMLElement = ensureElement<HTMLElement>('#modal-container')) {
    super(container);
    this.content = ensureElement<HTMLElement>('.modal__content', this.container);
    this.closeButton = ensureElement<HTMLButtonElement>('.modal__close', this.container);
    this.inner = ensureElement<HTMLElement>('.modal__container', this.container);

    this.closeButton.addEventListener('click', () => this.close());
    this.container.addEventListener('click', (e) => e.target === this.container && this.close());
    this.inner.addEventListener('click', (e) => e.stopPropagation());
    document.addEventListener('keydown', (e) => e.key === 'Escape' && this.close());
  }

  open(content: HTMLElement) {
    this.content.replaceChildren(content);
    this.container.classList.add('modal_active');
    document.body.classList.add('page__body_locked');
  }

  close() {
    this.container.classList.remove('modal_active');
    document.body.classList.remove('page__body_locked');
    this.content.replaceChildren();
    this.events.emit('modal:closed');
  }
}
