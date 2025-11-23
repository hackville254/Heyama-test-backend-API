import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';

async function bootstrap() {
  // Create the NestJS application instance
  const app = await NestFactory.create(AppModule);

  // Configure Swagger documentation
  const config = new DocumentBuilder()
    .setTitle('Heyama Objects API')
    .setDescription('REST API to manage Objects with S3 images')
    .setVersion('1.0')
    .addTag('objects')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document, { jsonDocumentUrl: 'api-json' });

  // Enable CORS for frontend testing and clients
  app.enableCors({ origin: true, credentials: true });

  // Global validation for DTOs
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));

  // Determine the port to listen on, defaulting to 3000 if not set
  const port = Number(process.env.PORT ?? 3000);

  try {
    await app.listen(port);
    console.log(`Server is running on http://localhost:${port}`);
  } catch (e: unknown) {
    const error = e as NodeJS.ErrnoException;
    // Handle the case where the port is already in use
    if (error?.code === 'EADDRINUSE') {
      const alt = port + 1;
      await app.listen(alt);
      console.log(`Server is running on http://localhost:${alt}`);
    } else {
      // Re-throw any other errors
      throw e;
    }
  }
}

// Start the bootstrap process
bootstrap().catch((err: unknown) => {
  const error = err instanceof Error ? err : new Error(String(err));
  console.error('Failed to start application:', error);
  process.exit(1);
});
