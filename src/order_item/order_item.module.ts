import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { OrderItemController } from "./order_item.controller";
import { OrderItem } from "./order_item.entity";
import { OrderItemService } from "./order_item.service";

@Module({
    imports: [TypeOrmModule.forFeature([OrderItem])],
    providers: [OrderItemService],
    controllers: [OrderItemController]
})

export class OrderItemModule {}