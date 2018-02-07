import { Injectable } from '@angular/core';
import { APIService, IProjectListResponse, IProject, IProjectResponse } from '../../api/api.service';
export { IProject } from '../../api/api.service';

@Injectable()
export class ProjectService {
  constructor(protected api: APIService) {}
  list(page: number = 1, pageSize: number = 10) {
    return this.api.get<IProjectListResponse>('projects', { page, pageSize });
  }
  update(project: IProject) {
    return this.api.put<IProjectResponse>(`projects/${project.id}`, project);
  }
  create(project: IProject) {
    return this.api.post<IProjectResponse>('projects', project);
  }
  delete(projectId: string | number) {
    return this.api.delete<IProjectResponse>(`projects/${projectId}`);
  }
}