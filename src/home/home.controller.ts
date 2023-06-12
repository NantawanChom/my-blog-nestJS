import { Controller, Get, Render } from '@nestjs/common';
import { HomeService } from './home.service';

@Controller()
export class HomeController {
  constructor(private readonly homeService: HomeService) {}

  @Get()
  @Render('home')
  getHello(): object {
    return { title: 'My blog', message: 'Hello, My Blog!' };
  }
}
