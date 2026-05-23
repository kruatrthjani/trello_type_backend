import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { ProjectDto } from './projectdto/project.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { UpdateProjectDto } from './projectdto/update.dto';

@Injectable()
export class ProjectService {
  constructor(private readonly prisma: PrismaService) {}
  async getProjects() {
    const data = await this.prisma.projects.findMany({});
    console.log('all projects', data);
    return data;
  }

  async createProject(obj: ProjectDto, userId: string) {
    try {
      const founded = await this.prisma.projects.findUnique({
        where: {
          projectName_clientId: {
            projectName: obj.projectName,
            clientId: obj.clientId ?? '',
          },
        },
      });
      if (founded) {
        throw new ConflictException('Project already exist');
      }
      const data= await this.prisma.projects.create({
        data: {
          ...obj,
          // Assign based on user role - will need user info
          projectManagerId: userId,
        },
      });
      return {data,message:"Project created successfully"}
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async updateProject(
    projectId: string,
    dto: UpdateProjectDto,
    userId: string,
  ) {
    try {
      // Check if project exists
      const project = await this.prisma.projects.findUnique({
        where: { projectId },
      });
console.log("userId=",userId)
      if (!project) {
        throw new NotFoundException('Project not found');
      }

      // Verify user is the manager or client of the project
      const isAuthorized =
        project.projectManagerId === userId || project.clientId === userId;

      if (!isAuthorized) {
        throw new ForbiddenException(
          'You are not authorized to update this project. Only the project manager or client can update it.',
        );
      }

      const data= await this.prisma.projects.update({
        where: { projectId },
        data: dto,
      });
      return {message:"Project updated successfully",data}
    } catch (error) {
      if (error instanceof ForbiddenException) {
        throw error;
      }
      throw new NotFoundException('Project not found');
    }
  }

  async deleteProject(projectId: string, userId: string) {
    try {
      // Check if project exists
      const project = await this.prisma.projects.findUnique({
        where: { projectId },
      });

      if (!project) {
        throw new NotFoundException('Project not found');
      }
      

      // Verify user is the manager or client of the project
      const isAuthorized =
        project.projectManagerId === userId || project.clientId === userId;

      if (!isAuthorized) {
        throw new ForbiddenException(
          'You are not authorized to delete this project. Only the project manager or client can delete it.',
        );
      }

      const data = await this.prisma.projects.delete({
        where: { projectId },
      });
      return {message:"Project deleted Successfully",data}
    } catch (error) {
      if (error instanceof ForbiddenException) {
        throw error;
      }
      throw new NotFoundException('Project not found');
    }
  }
}
