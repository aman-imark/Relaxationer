import { Component, OnInit, ElementRef, ViewChild, Renderer2 } from '@angular/core';

import { ModalController } from '@ionic/angular';

import { IonDatetime } from '@ionic/angular';
import { format, formatISO, parseISO } from 'date-fns';

@Component({
  selector: 'app-date-month-year',
  templateUrl: './date-month-year.page.html',
  styleUrls: ['./date-month-year.page.scss'],
})
export class DateMonthYearPage implements OnInit {
  @ViewChild(IonDatetime, { static: true }) datetime: IonDatetime;

  returnDOBval;
  currentDate;
  dateValue;

  constructor(public modalCtrl: ModalController) { }

   ionViewWillEnter(){
     let currYear = new Date();
     this.currentDate = formatISO(new Date(currYear));
   }


  formatDate(value: any) {
    // return format(parseISO(value), 'dd-MM-yyyy');
    return format(parseISO(value), 'yyyy-MM-dd');
  }


  dateConfirm(){
    // this.returnDOBval = {'dob': this.dateValue};
    // console.log(this.returnDOBval);

    this.returnDOBval = {'dob': this.dateValue};
    console.log(this.returnDOBval)
    this.modalCtrl.dismiss(this.returnDOBval);
  }

  dismiss() {
    this.modalCtrl.dismiss();
  } 
 

  ngOnInit() {
  }


}
