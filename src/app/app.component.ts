import {
  Component,
  ViewChild,
  ElementRef,
  Input
} from '@angular/core';
import { ListWebComponent } from './list.web-component';

@Component({
  selector: 'my-app',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  @ViewChild('list') list: ElementRef<ListWebComponent>;
  @Input() initialList = '1,2,3';
  name = 'web component example';
  nextItem = 0;
  currentList = '';

  ngOnInit() {
    if (!customElements.get('list-web-component')) {
      customElements.define('list-web-component', ListWebComponent);
    }
    document.addEventListener('clickItem', this._onClickItem);
  }

  ngAfterViewInit() {
    if (this.initialList) {
      this.currentList = this.initialList;
      const parts = this.initialList.split(',');
      this.nextItem = parseInt(parts[parts.length - 1]) + 1;
    }
    this.list.nativeElement.setAttribute('items', this.currentList);
  }

  addItem() {
    this.currentList += ',' + this.nextItem;
    this.nextItem++;
    this.list.nativeElement.setAttribute('items', this.currentList);
  }

  _onClickItem(x: CustomEvent) {
    alert(x.detail + ' selected!');
  }

  ngOnDestroy() {
    document.removeEventListener('clickItem', this._onClickItem);
  }
}
