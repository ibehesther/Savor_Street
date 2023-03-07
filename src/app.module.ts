import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ConfigService } from '@nestjs/config/dist';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MenuItem } from './menu_item/menu_item.entity';
import { MenuItemModule } from './menu_item/menu_item.module';
import { ValidationPipe } from './pipes/validation.pipe';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async(configService: ConfigService) => ({
        "type": "mysql",
        "host": "127.0.0.1",
        "port": 3306,
        "username": configService.get('DATABASE_USER'),
        "password": configService.get('DATABASE_PASSWORD'),
        "database": configService.get('DATABASE_NAME'),
        "entities": [MenuItem],
        "migrations": ["src/migration/**/*.ts"],
        "autoLoadEntities": true,
        "synchronize": false
      }),
      inject: [ConfigService]
  }),
  MenuItemModule
  ],
  controllers: [AppController],
  providers: [
    AppService, {
      provide: "APP_PIPE",
      useClass: ValidationPipe
    }
  ],
})
export class AppModule {}
