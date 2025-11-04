import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

// imports
import { ResponseInterceptor } from './core/interceptor';
import { CacheInterceptor } from './core/interceptor'; 
import { HttpExceptionFilter } from './core/filter';
import { ValidationFilter } from './core/filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const configService = app.get(ConfigService); // require configService to access env

  // define env and urls
  const environment = configService.get<string>('ENVIRONMENT') || 'development';
  const reactDevUrl =
    configService.get<string>('REACT_DEV_URL') || 'http://localhost:5173';
  const reactProdUrl = configService.get<string>('REACT_PROD_URL');

  // convert urls to array
  const allowedOrigins =
    environment === 'development' ? [reactDevUrl] : [reactProdUrl];

  // cors setup
  app.enableCors({
    origin: allowedOrigins,
    credentials: true,
  });

  // use interceptors
  app.useGlobalInterceptors(new ResponseInterceptor());

  // use filters
  app.useGlobalFilters(new HttpExceptionFilter(), new ValidationFilter());

  // the validationPipe enables the correct data flow by preventing unauthorized body sent
  // as well as cleaning the body sent. It also enforces type conversions, so it can convert
  // data as required by the backend type
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
