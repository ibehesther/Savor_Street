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
import { OrderItem } from './src/order_item/order_item.entity';
import { CreateOrderItemTable1678495018851 } from './migrations/1678495018851-CreateOrderItemTable';
import { Order } from './src/order/order.entity';
import { CreateOrderTable1678548795856 } from './migrations/1678548795856-CreateOrderTable';
import { Review } from './src/review/review.entity';
import { CreateReviewTable1678574998192 } from './migrations/1678574998192-CreateReviewTable';

config();

const configService = new ConfigService();

export const connection : DataSourceOptions= {
    "type": "mysql",
    "host":  configService.get('DATABASE_HOST'),
    "port": 3306,
    "username": configService.get('DATABASE_USER'),
    "password": configService.get('DATABASE_PASSWORD'),
    "database": configService.get('DATABASE_NAME'),
    "connectTimeout": 10000,
    "acquireTimeout": 10000,
    "entities": [
        MenuItem, 
        User,
        OrderItem,
        Order,
        Review
     ],
    "migrations": [
        CreateMenuItemTable1678068242897,
        MakeNameColumnUnique1678069149174,
        MakeDescriptionLongText1678069814342,
        CreateUserTable1678488782517,
        RemoveUniqueConstraintFromBrowser1678490688628,
        CreateOrderItemTable1678495018851,
        CreateOrderTable1678548795856,
        CreateReviewTable1678574998192
    ],
    synchronize: false,
    migrationsRun: true
}

export default new DataSource({
    ...connection
})