import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    rawBody: true,
  });
  
  app.enableCors({
    origin: ['https://course-platform-gkdsevvbd-sanaalothman99s-projects.vercel.app', 'http://localhost:3000'],
    credentials: true,
  });

  const port = process.env.PORT || 3001;
  await app.listen(port);
  
  console.log(`Application running on port ${port}`);
}

bootstrap();