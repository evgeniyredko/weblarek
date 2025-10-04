import { Component } from '../base/Component';
import { ensureElement } from '../../utils/utils';

interface IGallery {
  catalog: HTMLElement[];
}

export class Gallery extends Component<IGallery> {
  protected catalogElement: HTMLElement;

  constructor(container = ensureElement<HTMLElement>('main.gallery')) {
    super(container);
    this.catalogElement = this.container;
  }

  set catalog(items: HTMLElement[]) {
    this.catalogElement.replaceChildren(...items);
  }
}
