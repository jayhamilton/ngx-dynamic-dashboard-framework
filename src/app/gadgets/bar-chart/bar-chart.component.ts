import { Component, OnInit } from '@angular/core';
import { Color, ScaleType } from '@swimlane/ngx-charts';
import { BoardService } from 'src/app/board/board.service';
import { EventService } from 'src/app/eventservice/event.service';
import { GadgetBase } from '../common/gadget-common/gadget-base/gadget.base';
import * as footballstatsfromfile  from '../../../assets/api/footballstats.json'
import { HttpClientModule } from '@angular/common/http';


@Component({
  selector: 'app-bar-chart',
  templateUrl: './bar-chart.component.html',
  styleUrls: ['./bar-chart.component.scss']
})
export class BarChartComponent extends GadgetBase implements OnInit {
  // changed variables and added names and values for football stats array 
  buttonChecked;
  players;
  yards;
  dataFromFile;
  footballstats;
  average;
  variance;
  averageAge;
  averageAgeLabel;
  standardDeviation;
  threeSigma;
  threeSigmaLabel;
  averageLabel;
  varianceLabel;
  standardDeviationLabel;

  data: any = footballstatsfromfile;
// getting data from the file

  colorScheme: Color = {
    domain: ['#5AA454', '#E44D25', '#CFC0BB', '#7aa3e5', '#a8385d', '#aae3f5'],
    name: '',
    selectable: false,
    group: ScaleType.Linear
  };

  constructor(private eventService: EventService, private boardService: BoardService, private restClient: HttpClientModule) {
    super();
    
    this.players = "Players";
    this.yards = "Total Yards";
    this.footballstats = this.setFootballStats();
    this.dataFromFile = this.getDataFromFile();
    this.buttonChecked = false;
/**
 * created a sort method
 */
    this.footballstats.sort((a, b) => b.value - a.value);
    this.average = this.getAverage();
    this.variance = this.getVariance();
    this.standardDeviation = this.getStandardDeviation();
    this.threeSigma = this.getSigma();
    this.averageAge = this.getaverageAge();
    this.averageAgeLabel = "Average Age:";
    this.averageLabel = "Average:";
    this.varianceLabel = "Variance:";
    this.standardDeviationLabel = "Standard Deviation:";
    this.threeSigmaLabel = "Sigma:";
  }

  ngOnInit(): void {
    console.log('Data', this.data);
    // getting data from file still showing up as a module
  }

  remove() {
    this.eventService.emitGadgetDeleteEvent({ data: this.instanceId });
  }
  propertyChangeEvent(propertiesJSON: string) {
    //update internal props
    const updatedPropsObject = JSON.parse(propertiesJSON);

    if (updatedPropsObject.title != undefined) {
      this.title = updatedPropsObject.title;
    }
    if (updatedPropsObject.subtitle != undefined) {
      this.subtitle = updatedPropsObject.subtitle;
      console.log.apply(this.subtitle);
    }

    //persist changes
    this.boardService.savePropertyPageConfigurationToDestination(
      propertiesJSON,
      this.instanceId
    );
  }
  /**
   * created an average function
   * @returns 
   */
  getAverage() {

    let sum = 0;
    this.footballstats.forEach(data => {

      sum = data.value + sum;

    });

    return sum / this.footballstats.length;

  }
  /**
   * created a variance function
   * @returns 
   */
  getVariance() {

    let average = this.getAverage();
    // created a loop for the variance formula
    let variance = 0;
    this.footballstats.forEach(data => {

      variance = ((data.value - average) ** 2 + variance);

    });

    let varianceTotal = variance / this.footballstats.length;

    return varianceTotal;

  }
  /**
   * created a standard deviation function
   * @returns 
   */
  getStandardDeviation() {

    let sd = Math.sqrt(this.getVariance());

    return Math.round(sd);
  }

  getSigma() {

    let sigma = this.standardDeviation * (3)

    return sigma

  }
  getaverageAge() {

    let sum = 0
    this.footballstats.forEach(data => {

      sum = data.age + sum;

    });

    return sum / this.footballstats.length;

  }
/**
 * created a function for setfootballstats
 * @returns 
 * 
 */
  setFootballStats() {
    return [
      { name: "mason", value: 105, age: 19 },
      { name: "mendez", value: 550, age: 22 },
      { name: "reily", value: 150, age: 21 },
      { name: "mickens", value: 750, age: 21 },
      { name: "jamie", value: 850, age: 20 },
      { name: "ortiz", value: 105, age: 21 },
      { name: "willis", value: 550, age: 22 },
      { name: "primus", value: 250, age: 19 },
      { name: "burges", value: 350, age: 21 },
      { name: "lewis", value: 50, age: 22 }
    ];
  }
  getDataFromFile(){
    console.log ("testing function");
    console.log (footballstatsfromfile);
    //still coming up as a module
  }

   
 toggleStatistics() {
  console.log ('button clicked')
  this.buttonChecked= !this.buttonChecked;
}


  }
