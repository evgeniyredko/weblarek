import { Component } from '../base/Component';
import { ensureElement } from '../../utils/utils';

interface IGallery {
  catalog: HTMLElement[];
}

export class Gallery extends Component<IGallery> {
  protected catalogElement: HTMLElement;

  constructor(container: HTMLElement = ensureElement<HTMLElement>('main.gallery')) {
    super(container);
    this.catalogElement = container;
  }

  set catalog(items: HTMLElement[]) {
    this.catalogElement.replaceChildren(...items);
  }
}
