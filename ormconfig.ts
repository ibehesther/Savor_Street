import { DataSource, DataSourceOptions } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { config } from 'dotenv';
import { MenuItem } from './src/menu_item/menu_item.entity';
import { CreateMenuItemTable1678068242897 } from './migrations/1678068242897-CreateMenuItemTable';
import { MakeNameColumnUnique1678069149174 } from './migrations/1678069149174-MakeNameColumnUnique';
import { MakeDescriptionLongText1678069814342 } from './migrations/1678069814342-MakeDescriptionLongText';
import { User } from './src/user/user.entity';
import { CreateUserTable1678488782517 } from './migrations/1678488782517-CreateUserTable';
import { RemoveUniqueConstraintFromBrowser1678490688628 } from './migrations/1678490688628-RemoveUniqueConstraintFromBrowser';

config();

const configService = new ConfigService();

export const connection : DataSourceOptions= {
    "type": "mysql",
    "host": "127.0.0.1",
    "port": 3306,
    "username": configService.get('DATABASE_USER'),
    "password": configService.get('DATABASE_PASSWORD'),
    "database": configService.get('DATABASE_NAME'),
    "entities": [ MenuItem, User ],
    "migrations": [
        CreateMenuItemTable1678068242897,
        MakeNameColumnUnique1678069149174,
        MakeDescriptionLongText1678069814342,
        CreateUserTable1678488782517,
        RemoveUniqueConstraintFromBrowser1678490688628
    ],
    synchronize: false,
    migrationsRun: true
}

export default new DataSource({
    ...connection
})