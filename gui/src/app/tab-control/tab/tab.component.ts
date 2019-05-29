import { Component, OnInit, Input, Output, EventEmitter } from "@angular/core";

@Component({
  selector: "app-tab",
  templateUrl: "./tab.component.html",
  styleUrls: ["./tab.component.scss"]
})
export class TabComponent implements OnInit {
  @Input() title: string;
  @Input() selected = false;
  @Output() activated = new EventEmitter();
  @Output() deactivated = new EventEmitter();

  constructor() {}

  ngOnInit() {}
}
