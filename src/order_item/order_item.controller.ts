import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, ParseIntPipe, Patch, Post, Query, Session, UsePipes, Req} from "@nestjs/common";
import { Request } from "express";
import { APIFeatures } from "src/dto/apiFeatures.dto";
import { CreateOrderItemDTO } from "src/dto/create_order_item.dto";
import { UpdateOrderItemDTO } from "src/dto/update_order_item.dto";
import { ValidationPipe } from "src/pipes/validation.pipe";
import { OrderItemService } from "./order_item.service";


@Controller('api/order_items')
export class OrderItemController {
    constructor(private readonly orderItemService: OrderItemService) {}

    @Get()
    async getAllOrderItems(@Query() query: APIFeatures ) {
        return await this.orderItemService.getAll(query)
    }

    @Get(":id")
    @HttpCode(HttpStatus.OK)
    async getOrderItemByOrderId(@Param('id', ParseIntPipe) id: number) {
        return await this.orderItemService.getByOrderId(id);
    }

    @Post()
    @UsePipes(new ValidationPipe())
    async createOrderItem(@Body() body: CreateOrderItemDTO) {
        return await this.orderItemService.create(body)
    }

    @Patch(':id')
    async updateOrderItem(@Param('id', ParseIntPipe) id: number, @Body(new ValidationPipe()) body: UpdateOrderItemDTO) {
        return await this.orderItemService.update(id, body);
    }

    @Delete(':id')
    async deleteOrderItem(@Param('id', ParseIntPipe) id: number){
        return await this.orderItemService.delete(id)
    }

}