import { NestFactory } from '@nestjs/core';
import { HomeModule } from './home/home.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';

async function bootstrap() {
    const app = await NestFactory.create<NestExpressApplication>(HomeModule);
    app.setViewEngine('hbs');
    app.setBaseViewsDir(join(__dirname, '..', 'views'));
    app.useStaticAssets(join(__dirname, '..', 'public'));
    
    await app.listen(3000);
}

bootstrap();