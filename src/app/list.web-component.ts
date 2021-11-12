const rootTemplate = document.createElement('template');

const style = `
<style type="text/css">
  .item {
    border: 1px solid red; 
    padding: 1rem;
    margin: 1rem;
    width: 3rem;
    cursor: pointer;
  }
  .item > div {
    text-align: center;
  }
  </style>
`;

const markup = `
  <article>
    <slot name="list-container"></slot>
  </article>
`;

rootTemplate.innerHTML = style + markup;

export class ListWebComponent extends HTMLElement {
  static get observedAttributes() {
    return ['items'];
  }

  items: string[] = [];
  itemTemplate;
  constructor() {
    super();
    this.attachShadow({ mode: 'open' }).appendChild(
      rootTemplate.content.cloneNode(true)
    );
    this.itemTemplate = this.childNodes[0];
  }

  attributeChangedCallback(name, oldVal, newVal) {
    if (name === 'items' && oldVal !== newVal) {
      this.items = newVal.split(',');
      this.updateListContainerSlot();
    }
  }

  updateListContainerSlot() {
    const slots = this.shadowRoot.querySelectorAll('slot');
    if (!slots.length) {
      throw new Error('Slot was not found!');
    }
    slots[0].innerHTML = '';
    for (let i = 0; i < this.items.length; i++) {
      const template = this.itemTemplate
        ? this.applyTemplate(this.itemTemplate, this.items[i])
        : this.defaultTemplate(this.items[i]);
      slots[0].appendChild(template);
    }
  }

  defaultTemplate(item) {
    const listItem = document.createElement('li');
    listItem.innerHTML = `${item}`;
    listItem.addEventListener('click', this._onClick);
    return listItem;
  }

  applyTemplate(customTemplate, item) {
    const clonedContent = customTemplate.cloneNode(true);
    clonedContent.querySelector('[data-item]').innerHTML = item;
    clonedContent.addEventListener('click', this._onClick);
    return clonedContent;
  }

  _onClick(event) {
    document.dispatchEvent(
      new CustomEvent('clickItem', {
        detail:
          event.target.querySelector('[data-item]')?.innerHTML ||
          event.target.innerHTML,
      })
    );
  }

  disconnectedCallback() {
    document.removeEventListener('click', this._onClick);
  }
}
