import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import session from "express-session";
import { ConfigService } from "@nestjs/config";
import { config } from 'dotenv';
import { sessionStore } from './user/session.store';

config();

const configService = new ConfigService();


async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // const sessionRepository = Repository<Session>
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true
    }),
  );
  // app.use(SessionMiddleware);
  app.use(
    session({
      secret: configService.get("SESSION_SECRET"),
      resave: false,
      saveUninitialized: false,
      store: sessionStore,
      cookie: {
        httpOnly: true,
        maxAge: 1000 * 60 * 60 * 24,
      },
    }),
  )

  sessionStore.on('connect', () => {
    console.log('MySQLStore connected');
  });
  
  sessionStore.on('error', (error) => {
    console.log('MySQLStore error:', error);
  });
  
  sessionStore.on('disconnect', () => {
    console.log('MySQLStore disconnected');
  });
  await app.listen(3000);
}
bootstrap();
