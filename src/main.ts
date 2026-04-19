/*import { NestFactory } from '@nestjs/core';
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
  await app.listen(port,'0.0.0.0');
  
  console.log(`Application running on port ${port}`);
}

bootstrap();*/
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const port = Number(process.env.PORT) || 3001;

  app.getHttpAdapter().get('/ping', (_req, res) => {
    res.status(200).json({ ok: true });
  });

  await app.listen(port, '0.0.0.0');

  console.log('PORT =', port);
}
bootstrap();