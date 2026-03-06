import { Controller, Get, Injectable } from "@nestjs/common";
import { ProjectService } from "./projects.service";

@Controller("/project")
@Injectable()
export class ProjectController{
    constructor(private readonly projectservice:ProjectService){}

    @Get("/all")
    getProjects(){
       return this.projectservice.getProjects()
    }

    
}