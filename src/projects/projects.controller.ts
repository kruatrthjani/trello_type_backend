import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards, Req } from "@nestjs/common";
import { ProjectService } from "./projects.service";
import { ProjectDto } from "./projectdto/project.dto";
import { UpdateProjectDto } from "./projectdto/update.dto";
import { RolesGuard } from "src/auth/roles.guard";
import { Roles } from "src/auth/roles.decorator";

@Controller("project")
@UseGuards(RolesGuard)
export class ProjectController {

  constructor(private readonly projectService: ProjectService) {}

  @Get("all")
  getProjects() {
    return this.projectService.getProjects();
  }

  @Post("create")
  @Roles("MANAGER", "CLIENT")
  createProject(@Body() projectDto: ProjectDto, @Req() req: any) {
    const userId = req.user.id;
    return this.projectService.createProject(projectDto, userId);
  }

  @Patch("update")
  @Roles("MANAGER", "CLIENT")
  updateProject(@Body("projectId") projectId:string, @Body() updateProjectDto:UpdateProjectDto, @Req() req: any){
    const userId = req.user.id;
    return this.projectService.updateProject(projectId, updateProjectDto, userId)
  }

  @Delete("delete/:id")
  @Roles("MANAGER", "CLIENT")
  deleteProject(@Param("id") id:string, @Req() req: any){
    const userId = req.user.id;
    return this.projectService.deleteProject(id, userId)
  }
}