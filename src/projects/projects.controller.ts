import { Body, Controller, Get, Post } from "@nestjs/common";
import { ProjectService } from "./projects.service";
import { ProjectDto } from "./projectdto/project.dto";

@Controller("project")
export class ProjectController {

  constructor(private readonly projectService: ProjectService) {}

  @Get("all")
  getProjects() {
    return this.projectService.getProjects();
  }

  @Post("create")
  createProject(@Body() projectDto: ProjectDto) {

    // debugging payload
    // for (const [key, value] of Object.entries(projectDto)) {
    //   console.log(`${key}: ${value}`);
    // }

    return this.projectService.createProject(projectDto);
  }
}