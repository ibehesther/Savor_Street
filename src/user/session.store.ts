import MySQLStoreCreator from 'express-mysql-session';
import * as session from 'express-session';
import { ConfigService } from '@nestjs/config';
import { config } from 'dotenv';
import * as mysql2 from 'mysql2/promise'


config();

const configService = new ConfigService();

const MySQLStoreOptions = {
    "type": "mysql",
    "host": "127.0.0.1",
    "port": 3306,
    "username": configService.get('DATABASE_USER'),
    "password": configService.get('DATABASE_PASSWORD'),
    "database": configService.get('DATABASE_NAME'),
    clearExpired: true,
    checkExpirationInterval: 900000,
    expiration: 86400000,
    createDatabaseTable: true,
    schema: {
        tableName: 'sessions',
        columnNames: {
        session_id: 'session_id',
        expires: 'expires',
        data: 'data',
        device_type: 'device_type',
        device_os: 'device_os'
        },
    },
};

const connection = mysql2.createPool(MySQLStoreOptions);
  
export const sessionStore = new (MySQLStoreCreator(session))({}, connection);

