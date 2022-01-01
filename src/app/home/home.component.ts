import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { PersonalStatusService } from '../services/personal-status.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  isFetchingStatus: boolean = true;
  status: string = "Busy thinking about something.";
  statusIcons: string[] = [];

  constructor(private titleService: Title,
    private statusService: PersonalStatusService) {}

  public ngOnInit() {
    this.titleService.setTitle("Pedro Dias Marques <> pMarK");

    this.getStatus();
  }

  private getStatus() {
    this.statusService.getPersonalStatus().subscribe(
      (data: string) => {
        if (data) {
          this.parseStatusMsg(data);
        }

        this.isFetchingStatus = false;
      }, (error: any) => this.isFetchingStatus = false
    );
  }

  private parseStatusMsg(data: string) {
    try {
      const dataBits = data.split('@');

      if (dataBits.length > 1) {
        this.statusIcons = dataBits[0].split('/');
      }

      this.status = dataBits[dataBits.length - 1];
    } catch {
      console.error("Failed to parse status message.");
    }
  }
}
