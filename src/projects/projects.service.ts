import { ConflictException, Injectable, InternalServerErrorException, NotFoundException } from "@nestjs/common";
import { ProjectDto } from "./projectdto/project.dto";
import { PrismaService } from "src/prisma/prisma.service";
import { UpdateProjectDto } from "./projectdto/update.dto";

@Injectable()
export class ProjectService{
    constructor(private readonly prisma:PrismaService){}
    async getProjects(){
        const data=await this.prisma.projects.findMany({})
        console.log("all projects",data)
        return data
    }

    async createProject(obj:ProjectDto){
        // return obj;
        try{
            const founded=await this.prisma.projects.findUnique({
                where:{
                    projectName_clientName: {
                    projectName: obj.projectName,
                    clientName: obj.clientName ?? "",
                }
            }
            })
            if(founded){
                throw new ConflictException("Project already exist")
            }
            return await this.prisma.projects.create({
                data:{...obj}
            })
        }
        catch (error){
            throw new InternalServerErrorException(error)
        }
        // await this.prisma.projects.create({
        //     data: {...obj},
        // })
        // return {message:"Project created successfully"}
    }

    async updateProject(projectId: string, dto: UpdateProjectDto) {
    try {
        return await this.prisma.projects.update({
          where: { projectId },
          data: dto,
        });
    } catch {
    throw new NotFoundException("Project not found");
    }
    }   

    async deleteProject(projectId:string){
        try{
            return await this.prisma.projects.delete({
                where:{projectId}
            })

        }
        catch{
            throw new NotFoundException("Project not found")
        }
    }
}