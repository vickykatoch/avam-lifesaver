import { Component, OnInit } from '@angular/core';
import {
  trigger, state, style,
  animate, transition, keyframes
} from '@angular/animations';

@Component({
  selector: 'app-animatio-demo',
  templateUrl: './animatio-demo.component.html',
  styleUrls: ['./animatio-demo.component.scss'],
  styles : [

  ],
  animations: [
    trigger('myListTrigger', [
      state('fadeIn', style({
        opacity : '1'
      })),
      transition('void => *', [
        style({ opacity : '0', transform : 'translateY(-600px)'}),
        animate('500ms 0s ease-out')])
    ]),
    trigger('removeMe', [
      state('out' , style({
        transform: 'scale(0)',
        opacity: '0'
      })),
      transition('* => out', [
        animate('500ms 0s ease-in', keyframes([
          style({ opacity: 1, transform: 'translateX(-8px)', offset: 0}),
          style({ opacity: 1, transform: 'translateX(0)', offset: 0.3}),
          style({ opacity: 0, transform: 'translateX(50px)', offset: 1})
        ]))
      ])
    ])
  ]
})
export class AnimatioDemoComponent implements OnInit {
  state = 'fadeIn';
  items = ['One', 'Two'];
  btnState = '';
  constructor() { }
  ctr = 0;

  ngOnInit() {
  }
  toggleState() {
    this.items.unshift('Another Name' + (++this.ctr));
    this.state = 'fadeIn';
    this.btnState = 'out';
  }
}
