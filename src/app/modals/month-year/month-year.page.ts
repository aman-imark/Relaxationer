import { Component, OnInit, ElementRef, ViewChild, Renderer2 } from '@angular/core';

import { ModalController } from '@ionic/angular';

import { IonDatetime } from '@ionic/angular';
import { format, formatISO, parseISO } from 'date-fns';


@Component({
  selector: 'app-month-year',
  templateUrl: './month-year.page.html',
  styleUrls: ['./month-year.page.scss'],
})
export class MonthYearPage implements OnInit {

  @ViewChild(IonDatetime, { static: true }) datetime: IonDatetime;

  returnExpValue;

  currentYear;
  currentMonth;
  currentSet;
  currentDate;

  futureYear;
  futureMonth;
  futureSet;
  futureDate;

  dateValue = '';

  constructor(public modalCtrl: ModalController) { }

   ionViewWillEnter(){
     let currYear = new Date();
     this.currentYear = currYear.getFullYear();
     this.currentMonth = currYear.getMonth()+1; // for next one month
     this.currentSet = new Date(currYear.getFullYear(), currYear.getMonth());
     this.currentDate = formatISO(new Date(this.currentSet));
     
     let futYear = new Date(new Date().setFullYear(new Date().getFullYear() + 20));
     this.futureYear = futYear.getFullYear();
     this.futureMonth = futYear.getMonth();
     this.futureSet = new Date(new Date().setFullYear(new Date().getFullYear() + 20, new Date().getMonth()));
     this.futureDate = formatISO(new Date(this.futureSet));

    //  console.log(this.currentYear);
    //  console.log(this.currentSet);
    //  console.log(this.currentDate);
    //  console.log(this.futureYear);
    //  console.log(this.futureSet);
    //  console.log(this.futureDate);
   }


  formatDate(value: any) {
    return format(parseISO(value), 'MM/yyyy');
  }


  dismiss() {
    this.returnExpValue = {'exp': this.dateValue};
    this.modalCtrl.dismiss(this.returnExpValue);
    //  this.modalCtrl.dismiss({'dismissed': true});
  } 
 

  ngOnInit() {
  }


}
