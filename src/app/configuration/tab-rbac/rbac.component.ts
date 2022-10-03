import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-rbac',
  templateUrl: './rbac.component.html',
  styleUrls: ['./rbac.component.scss'],
})
export class TabRbacComponent implements OnInit {
  constructor() {}

  ngOnInit(): void {}
  roles = new FormControl('');
  roleList: string[] = ['Driver', 'Lead', 'Quality Control','Administrator'];
}
