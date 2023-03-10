import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ConfigService } from '@nestjs/config/dist';
import { TypeOrmModule } from '@nestjs/typeorm';
import { connection } from 'ormconfig';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MenuItemModule } from './menu_item/menu_item.module';
import { ValidationPipe } from './pipes/validation.pipe';
import { UserModule } from './user/user.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async(configService: ConfigService) => ({
        ...connection
      }),
      inject: [ConfigService]
    }),
    MenuItemModule,
    UserModule
  ],
  controllers: [AppController],
  providers: [
    AppService, 
    {
      provide: "APP_PIPE",
      useClass: ValidationPipe
    }
  ],
})
export class AppModule {}
