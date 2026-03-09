import { Injectable } from "@nestjs/common";
import { ProjectDto } from "./projectdto/project.dto";
import { PrismaService } from "src/prisma/prisma.service";

@Injectable()
export class ProjectService{
    constructor(private readonly prisma:PrismaService){}
    getProjects(){
        return "all projects"
    }

    async createProject(obj:ProjectDto){
        // return obj;
        await this.prisma.projects.create({
            data: {...obj},
        })
        return {message:"Project created successfully"}
    }
}