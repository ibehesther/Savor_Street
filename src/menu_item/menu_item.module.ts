import { Module } from "@nestjs/common";
import { TypeOrmModule } from '@nestjs/typeorm';
import { MenuItemController } from "./menu_item.controller";
import { MenuItem } from "./menu_item.entity";
import { MenuItemService } from "./menu_item.service";

@Module({
    imports: [TypeOrmModule.forFeature([MenuItem])],
    controllers: [MenuItemController],
    providers: [MenuItemService]
})
export class MenuItemModule {}
