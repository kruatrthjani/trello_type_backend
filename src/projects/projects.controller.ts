import { Body, Controller, Delete, Get, Param, Patch, Post } from "@nestjs/common";
import { ProjectService } from "./projects.service";
import { ProjectDto } from "./projectdto/project.dto";
import { UpdateProjectDto } from "./projectdto/update.dto";

@Controller("project")
export class ProjectController {

  constructor(private readonly projectService: ProjectService) {}

  @Get("all")
  getProjects() {
    return this.projectService.getProjects();
  }

  @Post("create")
  createProject(@Body() projectDto: ProjectDto) {
    return this.projectService.createProject(projectDto);
  }

  @Patch("update")
  updateProject(@Body("projectId") projectId:string ,@Body() updateProjectDto:UpdateProjectDto){
    return this.projectService.updateProject(projectId,updateProjectDto)
  }

  @Delete("delete/:id")
  deleteProject(@Param("id") id:string){
    return this.projectService.deleteProject(id)
  }
}