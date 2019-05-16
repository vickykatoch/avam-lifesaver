import {
  Component,
  OnInit,
  Input,
  ElementRef,
  Renderer2,
  RendererStyleFlags2
} from "@angular/core";

@Component({
  selector: "tab",
  templateUrl: "./tab.component.html",
  styleUrls: ["./tab.component.scss"]
})
export class TabComponent implements OnInit {
  @Input()
  title: string;

  private _selected = false;
  @Input() set selected(value: boolean) {
    this._selected = value;
  }
  get selected() {
    return this._selected;
  }

  constructor(private elem: ElementRef<any>, private render: Renderer2) {}

  ngOnInit() {
    // debugger;
    if (this._selected) {
      this.render.addClass(this.elem.nativeElement, "tab-visible");
      this.render.removeClass(this.elem.nativeElement, "tab-notvisible");
    } else {
      this.render.addClass(this.elem.nativeElement, "tab-notvisible");
      this.render.removeClass(this.elem.nativeElement, "tab-visible");
    }
  }
}
