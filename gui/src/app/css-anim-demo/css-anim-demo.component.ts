import { Component, OnInit } from "@angular/core";
import { IfStmt } from "@angular/compiler";

export interface Alert {
  css: string;
  title: string;
  description: string;
  expanded?: boolean;
  expandedCss?: string;
}
const CLASSES = ["slideInDown", "zoomOut"];

@Component({
  selector: "app-css-anim-demo",
  templateUrl: "./css-anim-demo.component.html",
  styleUrls: ["./css-anim-demo.component.scss"]
})
export class CssAnimDemoComponent implements OnInit {
  items = [
    {
      css: "slideInDown",
      title: "Alert",
      description: "Order Placed Successfully"
    }
  ];
  private ctr = 0;
  constructor() {}

  ngOnInit() {}

  onNew() {
    const c = ++this.ctr;
    this.items.unshift({
      css: "slideInDown",
      title: "Alert " + c,
      description: `Another Item : ${c}`
    });
  }
  onAnimationEnd(evt: any, item: Alert) {
    CLASSES.forEach(cls => {
      evt.target.classList.remove(cls);
    });
    item.css = "";
  }
  expand(evt: MouseEvent, alert: Alert) {
    const expanded = !alert.expanded;
    if (!expanded) {
      alert.expandedCss = "zoomOut";
      setTimeout(() => {
        alert.expanded = false;
      }, 500);
    } else {
      alert.expandedCss = "zoomIn";
      alert.expanded = true;
    }
    // const elem = this.findElem(evt.target as HTMLElement);
    // if (elem) {
    //   elem.classList.add("zoomIn");
    // }
  }
  remove(evt: MouseEvent, alert: Alert) {
    const elem = this.findElem(evt.target as HTMLElement);
    if (elem) {
      elem.classList.add("zoomOut");
      setTimeout(() => {
        this.items = this.items.filter(a => a !== alert);
      }, 500);
    } else {
      this.items = this.items.filter(a => a !== alert);
    }
  }
  private findElem(elem: HTMLElement) {
    let element: HTMLElement = elem;
    let foundElem: HTMLElement;
    while (true) {
      if (!element) {
        break;
      }
      if (element.classList.contains("animated")) {
        foundElem = element;
        break;
      }
      element = element.parentElement;
    }
    return foundElem;
  }
}
