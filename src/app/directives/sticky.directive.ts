import { Directive } from '@angular/core';



import {platformBrowserDynamic} from '@angular/platform-browser-dynamic';
import {
    Component,
    Renderer2,
    ElementRef,
    NgModule,
    Input,
    Output,
    EventEmitter
} from '@angular/core';


import {BrowserModule} from '@angular/platform-browser';

@Directive({
  selector: '[appSticky]'
})
export class StickyDirective {

  constructor() { }

}
