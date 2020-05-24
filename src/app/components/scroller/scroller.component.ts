import { Component, OnInit, HostListener } from '@angular/core';

@Component({
  selector: 'app-scroller',
  templateUrl: './scroller.component.html',
  styleUrls: ['./scroller.component.scss']
})
export class ScrollerComponent implements OnInit {

  showScroller: boolean;
  showScrollerPosition: 100;

  @HostListener('window:scroll')
  checkScroll() {
    const scrollPosition = window.pageXOffset || document.documentElement.scrollTop || document.body.scrollTop || 0;

    if(scrollPosition >= this.showScrollerPosition) {
      this.showScroller = true;
    } else {
      this.showScroller = false;
    }

  }

  gotoTop() {
    window.scroll({
      top: 0,
      left: 0,
      behavior: 'smooth'
    });
  }

  constructor() { }

  ngOnInit(): void {
  }

}
