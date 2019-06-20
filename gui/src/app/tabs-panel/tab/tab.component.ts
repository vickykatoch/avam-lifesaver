import { Component, OnInit, Input, ElementRef, Renderer2, Output, EventEmitter, RendererStyleFlags2 } from '@angular/core';

@Component({
  selector: 'app-tab',
  templateUrl: './tab.component.html',
  styleUrls: ['./tab.component.scss']
})
export class TabComponent implements OnInit {
  private _selected = false;
  @Input() header: string;
  @Input() yScroll = false;
  @Input() set selected(value: boolean) {
    this._selected = value;
    this.resolveViewVisibility();
  }
  get selected(): boolean {
    return this._selected;
  }
  @Output() activated = new EventEmitter();
  @Output() deactivated = new EventEmitter();

  constructor(private elem: ElementRef<any>, private renderer: Renderer2) { }

  ngOnInit() {
    this.resolveViewVisibility();
  }
  private resolveViewVisibility() {
    if (this._selected) {
      this.renderer.removeStyle(this.elem.nativeElement, 'display');
    } else {
      // tslint:disable-next-line: no-bitwise
      this.renderer.setStyle(this.elem.nativeElement, 'display', 'none', RendererStyleFlags2.DashCase | RendererStyleFlags2.Important);
    }
  }
}
