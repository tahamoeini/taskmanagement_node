import { Module } from '@nestjs/common';
// import { AppController } from './app.controller';
// import { AppService } from './app.service';
import { TasksModule } from './tasks/tasks.module';

//REM: nest g will auto create modules or etc

@Module({
  imports: [TasksModule],
  // controllers: [AppController],
  // providers: [AppService],
})
export class AppModule {}
