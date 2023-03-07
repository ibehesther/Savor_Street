import { DataSource } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { config } from 'dotenv';
import { MenuItem } from './src/menu_item/menu_item.entity';
import { CreateMenuItemTable1678068242897 } from './migrations/1678068242897-CreateMenuItemTable';
import { MakeNameColumnUnique1678069149174 } from './migrations/1678069149174-MakeNameColumnUnique';
import { MakeDescriptionLongText1678069814342 } from './migrations/1678069814342-MakeDescriptionLongText';

config();

const configService = new ConfigService();

export default new DataSource({
    "type": "mysql",
    "host": "127.0.0.1",
    "port": 3306,
    "username": configService.get('DATABASE_USER'),
    "password": configService.get('DATABASE_PASSWORD'),
    "database": configService.get('DATABASE_NAME'),
    "entities": [ MenuItem ],
    "migrations": [
        CreateMenuItemTable1678068242897,
        MakeNameColumnUnique1678069149174,
        MakeDescriptionLongText1678069814342,
    ],
    synchronize: false,
    migrationsRun: true
})