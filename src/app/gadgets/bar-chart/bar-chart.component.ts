import { AfterViewInit, Component, OnInit } from '@angular/core';
import { Color, ScaleType } from '@swimlane/ngx-charts';
import { BoardService } from 'src/app/board/board.service';
import { EventService } from 'src/app/eventservice/event.service';
import { GadgetBase } from '../common/gadget-common/gadget-base/gadget.base';
import * as footballstatsfromfile from '../../../assets/api/footballstats.json'
import { HttpClient } from '@angular/common/http';

export interface footballstatsInterface {
  stats: any[];
}


@Component({
    selector: 'app-bar-chart',
    templateUrl: './bar-chart.component.html',
    styleUrls: ['./bar-chart.component.scss'],
    standalone: false
})
export class BarChartComponent extends GadgetBase implements AfterViewInit {
  // changed variables and added names and values for football stats array 
  buttonChecked;
  players;
  yards;
  dataFromFile;
  footballstats: any[];
  // made the football stats pull from an array
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

  constructor(private eventService: EventService, private boardService: BoardService, private restClient: HttpClient) {
    //made an HTTPClient
    super();

    this.players = "Players";
    this.yards = "Total Yards";
    this.footballstats = [] //this.setFootballStats();
    this.dataFromFile = //this.getDataFromFile();
    this.buttonChecked = false;
    /**
     * created a sort method
     */
    
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

  ngAfterViewInit(): void {
    //console.log('Data', this.data);
    // getting data from file still showing up as a module
   
    this.getFootballStats().subscribe(data=>{
      console.log("data printed");
      console.log(data);
      this.footballstats = data.stats;
      this.footballstats.sort((a, b) => b.value - a.value);
    })
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
  
  getDataFromFile() {
    console.log("testing function");
    //console.log(footballstatsfromfile);
    //still coming up as a module
  }


  toggleStatistics() {
    console.log('button clicked')
    this.buttonChecked = !this.buttonChecked;
  }

  getFootballStats() {

    let url = "assets/api/footballstats.json";
    return this.restClient.get<footballstatsInterface>(url);
    // made a funtion to pull data from an array in a json file

  }

}
