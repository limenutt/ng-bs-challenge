import { Component, OnInit } from '@angular/core';
import { ProjectService, IProject } from '../../services/resources/project/project.service';

export interface IProjectView extends IProject {
  mode?: 'editing';
  backup?: IProject;
}
@Component({
  selector: 'projects-page',
  templateUrl: './projects.page.html',
  styleUrls: ['./projects.page.scss'],
  providers: [ProjectService]
})
export class ProjectsPage implements OnInit {
  protected page: number = 1;
  protected pageSize: number = 3;
  protected totalPages: number;
  protected projects: IProjectView[];
  protected pages: number[];
  constructor(protected service: ProjectService) {}
  ngOnInit() {
    this.loadPage();
  }
  startEditing(project: IProjectView) {
    if (project.mode === 'editing') {
      return;
    }
    project.mode = 'editing';
    project.backup = Object.assign({}, project);
  }
  cancel(project: IProjectView) {
    // we are cancelling a draft project
    if (!project.id) {
      const idx = this.projects.indexOf(project);
      this.projects.splice(idx, 1);
      return;
    }
    // we need to restore the project to its previous state
    if (project.backup) {
      Object.keys(project.backup).forEach(property => {
        if (!['mode', 'backup'].includes(property)) {
          project[property] = project.backup[property];
        }
      });
    }
    project.mode = null;
    delete project.backup;
  }
  loadPage(page: number = this.page, pageSize: number = this.pageSize) {
    this.service.list(page, pageSize).subscribe(response => {
      this.page = response.page
      this.pageSize = response.pageSize;
      this.totalPages = response.totalPages;
      this.projects = response.projects;
      this.pages = [];
      for (let i = 1; i <= this.totalPages; i++) {
        this.pages.push(i);
      }
    });
  }
  saveProject(project: IProjectView) {
    if (project.id) {
      this.service.update(project).subscribe(response => {
        const idx = this.projects.findIndex(project => project.id === response.project.id);
        if (idx !== -1) {
          this.projects[idx] = response.project;
        }
      });
    } else {
      this.service.create(project).subscribe(response => {
        const idx = this.projects.indexOf(project);
        if (idx !== -1) {
          this.projects[idx] = response.project;
        }
      });
    }
  }
  createProject(project: IProject) {
    this.service.create(project).subscribe(response => this.loadPage());
  }
  deleteProject(project: IProject) {
    this.service.delete(project.id).subscribe(response => this.loadPage());
  }
  addProject() {
    this.projects.unshift(<any>{
      mode: 'editing'
    });
  }
}