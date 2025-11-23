import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  // Create the NestJS application instance
  const app = await NestFactory.create(AppModule);

  // Configure Swagger documentation
  const config = new DocumentBuilder()
    .setTitle('Heyama API')
    .setDescription('API documentation for the Heyama application')
    .setVersion('1.0')
    .build();
  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, documentFactory);

  // Determine the port to listen on, defaulting to 3000 if not set
  const port = Number(process.env.PORT ?? 3000);

  try {
    // Attempt to start the server on the specified port
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
