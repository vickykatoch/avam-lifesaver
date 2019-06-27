import { Component, OnInit } from "@angular/core";
import {
  trigger,
  state,
  style,
  animate,
  transition,
  keyframes
} from "@angular/animations";

@Component({
  selector: "app-animation-demo",
  templateUrl: "./animatio-demo.component.html",
  styleUrls: ["./animatio-demo.component.scss"],
  styles: []
})
export class AnimatioDemoComponent implements OnInit {
  state = "fadeIn";
  items = ["One", "Two"];
  btnState = "";
  constructor() {}
  ctr = 0;

  ngOnInit() {}
  toggleState() {
    this.items.unshift("Another Name" + ++this.ctr);
    this.state = "fadeIn";
    // this.btnState = 'out';
  }
  onAnimationEnd(evt: any) {
    evt.target.classList.remove("slideInDown");
  }
  remove(evt: any, item: string) {
    evt.target.parentElement.classList.add("fadeOut");
    setTimeout(() => {
      this.items = this.items.filter(x => x !== item);
    }, 500);
  }
}
