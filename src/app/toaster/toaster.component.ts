import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-toaster',
  templateUrl: './toaster.component.html',
  styleUrls: ['./toaster.component.scss']
})
export class ToasterComponent {
  @Input() show = false;

  constructor() {
  }

  reload() {
    document.location.reload();
  }
}
