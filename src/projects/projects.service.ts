import { Injectable } from "@nestjs/common";

@Injectable()
export class ProjectService{
    
    getProjects(){
        return "all projects"
    }

    
}