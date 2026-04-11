import { Controller, Get } from '@nestjs/common';
import { Public } from './auth/public.decorator';
import { AppService } from './app.service';
import { ProjectService } from './projects/projects.service';

@Public()
@Controller()
export class AppController {
  constructor(private readonly appService: AppService,private readonly projectservice:ProjectService) {}
  
  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
  
  @Get("/pr")
  getprojects(){
     return this.projectservice.getProjects();
  }
}
