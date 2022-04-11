import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AppObject } from '../models/appObject';
import { SharedService } from '../shared/shared.service';

@Component({
  selector: 'app-device',
  templateUrl: './device.component.html',
  styleUrls: ['./device.component.css']
})
export class DeviceComponent implements OnInit {
  getdeviceLoading = false;
  device: AppObject;
  getcomponentListLoading = false;
  componentList: AppObject[];
  getthreatListLoading = false;
  threatList: AppObject[];
  countermList: AppObject[];

  constructor(
    private route: ActivatedRoute,
    private sharedService: SharedService,
    private toastr: ToastrService
  ) { }
  ngOnInit() {
    this.device = new AppObject();
    this.route.paramMap.subscribe(params => {
      this.device.id = +params.get('id');
    });

    this.getDeviceById();
    this.getComponentsByDevice();
  }

  getDeviceById() {
    this.getdeviceLoading = true;
    this.sharedService.getDeviceById(this.device.id)
      .subscribe(
        (response: AppObject) => {
          this.device = response;
        },
        (error) => {
          this.toastr.error("Failed to device details. Please contact system administrator.", "System error..",
            { closeButton: true, progressBar: true, timeOut: 0, extendedTimeOut: 1500 });
        }
      ).add(() => {
        this.getdeviceLoading = false;
      });
  }

  getComponentsByDevice() {
    this.getcomponentListLoading = true;
    this.sharedService.getChildrenByParentId(this.device.id)
      .subscribe(
        (response: AppObject[]) => {
          this.componentList = response;
        },
        (error) => {
          this.toastr.error("Failed to components. Please contact system administrator.", "System error..",
            { closeButton: true, progressBar: true, timeOut: 0, extendedTimeOut: 1500 });
        }
      ).add(() => {
        this.getcomponentListLoading = false;
      });
  }

  getThreatsByComponents() {
    let parentIds = [];
    this.getthreatListLoading = true;
    this.componentList.forEach(element => {
      parentIds.push(element.id);
    });

    this.sharedService.getThreatsByComponents(parentIds)
      .subscribe(
        (response: AppObject[]) => {
          this.threatList = response;
        },
        (error) => {
          this.toastr.error("Failed to retrieve threats. Please contact system administrator.", "System error..",
            { closeButton: true, progressBar: true, timeOut: 0, extendedTimeOut: 1500 });
        }
      ).add(() => {
        this.getthreatListLoading = false;
      });
  }

  getCountermByThreats() {
    this.countermList = [];
  }

}
