import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Project } from '../core/project';
import { PersonalStatusService } from '../services/personal-status.service';
import { ProjectsService } from '../services/projects.service';
import { SnackService } from '../services/snack.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  isFetchingStatus: boolean = true;
  isFetchingProjects: boolean = true;
  status: string = "Busy thinking about something.";
  statusIcons: string[] = [];
  projectsList: Project[] = [];

  constructor(private titleService: Title,
    private statusService: PersonalStatusService,
    private projectsService: ProjectsService,
    private snackService: SnackService) {}

  public ngOnInit() {
    this.titleService.setTitle("Pedro Dias Marques <> pMarK");

    this.getStatus();
    this.getProjects();
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

  private getProjects() {
    this.projectsService.getProjectsList().subscribe(
      (data: Project[]) => {
        this.projectsList = data;
        this.isFetchingProjects = false;
      }, (error: any) => this.snackService.showSnackBar(error, 'OK')
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
