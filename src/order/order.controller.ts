import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, ParseIntPipe, Patch, Post, Query, Session, UsePipes, Req, ParseUUIDPipe} from "@nestjs/common";
import { Request } from "express";
import { APIFeatures } from "src/dto/apiFeatures.dto";
import { CreateOrderDTO } from "src/dto/create_order.dto";
import { UpdateOrderDTO } from "src/dto/update_order.dto";
import { ValidationPipe } from "src/pipes/validation.pipe";
import { OrderService } from "./order.service";


@Controller('api/orders')
export class OrderController {
    constructor(private readonly orderService: OrderService) {}

    @Get()
    async getAllOrders(@Query() query: APIFeatures ) {
        return await this.orderService.getAll(query)
    }

    @Get(":id")
    @HttpCode(HttpStatus.OK)
    async getOrderById(@Param('id', ParseUUIDPipe) id: string) {
        return await this.orderService.getByUserId(id);
    }

    @Post()
    @UsePipes(new ValidationPipe())
    async createOrder(@Body() body: CreateOrderDTO) {
        return await this.orderService.create(body)
    }

    @Patch(':id')
    async updateOrder(@Param('id', ParseIntPipe) id: number, @Body(new ValidationPipe()) body: UpdateOrderDTO) {
        return await this.orderService.update(id, body);
    }

    @Delete(':id')
    async deleteOrder(@Param('id', ParseIntPipe) id: number){
        return await this.orderService.delete(id)
    }

}