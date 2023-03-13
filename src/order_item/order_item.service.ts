import { BadRequestException, HttpException, Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { APIFeatures } from "src/dto/apiFeatures.dto";
import { CreateOrderItemDTO } from "src/dto/create_order_item.dto";
import { UpdateOrderItemDTO } from "src/dto/update_order_item.dto";
import { Repository } from "typeorm";
import { OrderItem } from "./order_item.entity";

@Injectable()
export class OrderItemService{
    constructor(
        @InjectRepository(OrderItem)
        private orderItemRepository
        : Repository<OrderItem>
    ) {}

    async getAll(query: APIFeatures, ): Promise<OrderItem[]> {
        let { page= 1, limit= 10 } = query;
        page *= 1;
        limit *= 1;
        return await this.orderItemRepository
        .find({
            skip: (page - 1) * limit,
            take: limit,
            where: {

            },
            order: {
                id: "ASC"
            }
        })
    }

    async getByOrderId(id: number): Promise<OrderItem[] | HttpException> {
        let orderItem =await this.orderItemRepository.findBy({order_id: id})

        if(!orderItem) throw new NotFoundException(`No Item with order id- ${id} was not found in the database`);

        return orderItem;
    }

    async create(body: CreateOrderItemDTO): Promise<OrderItem | HttpException> {
        try{
            let orderItem = this.orderItemRepository.create(body)
            await this.orderItemRepository.save(orderItem);
           
            return orderItem;
        }catch (error) {
            throw new BadRequestException("Order Item not created due to bad request data")
        }
    }

    async update(id: number, body: UpdateOrderItemDTO){
        try{
            let order_item = await this.orderItemRepository.findOneBy({id});
            
            if(!order_item) return new NotFoundException(`Order item with id- ${id} was not found`).getResponse();

            let filtered_body = Object.fromEntries(
                Object.entries(body).filter(([key, value]) => value !== undefined)
            );

            Object.assign(order_item, filtered_body)

            await this.orderItemRepository.save(order_item);
            return order_item
        }
        catch(error){
            throw new BadRequestException("Order Item not updated due to bad request data")
        }
    }

    async delete(id: number) {
        const order_item = await this.orderItemRepository.findOneBy({id});

        if(!order_item) throw new NotFoundException(`Order item with id- ${id} was not found`)
        await this.orderItemRepository.remove(order_item);

        return order_item
    }
}