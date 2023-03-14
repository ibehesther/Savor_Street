import { BadRequestException, HttpException, NotFoundException } from "@nestjs/common";
import { Injectable } from "@nestjs/common/decorators";
import { InjectRepository } from "@nestjs/typeorm";
import { APIFeatures } from "src/dto/apiFeatures.dto";
import { CreateOrderDTO } from "src/dto/create_order.dto";
import { UpdateOrderDTO } from "src/dto/update_order.dto";
import { Repository } from "typeorm";
import { Order } from "./order.entity";

@Injectable()
export class OrderService{
    constructor(
        @InjectRepository(Order)
        private orderRepository: Repository<Order>
    ) {}

    async getAll(query: APIFeatures, ): Promise<Order[]> {
        let { page= 1, limit= 10 } = query;
        page *= 1;
        limit *= 1;
        return await this.orderRepository
        .find({
            skip: (page - 1) * limit,
            take: limit,
            where: {

            },
            order: {
                id: "DESC"
            }
        })
    }

    async getByUserId(id: string, query: APIFeatures): Promise<Order[] | HttpException> {
        let { page= 1, limit= 10 } = query;
        page *= 1;
        limit *= 1;
        let orders =await this.orderRepository.find({
            skip: (page - 1) * limit,
            take: limit,
            where: {user_id: id},
            order: {
                id: "DESC"
            }
        });
        if(!orders) throw new NotFoundException(`Orders for user was not found in the database`);

        return orders;
    }

    async create(body: CreateOrderDTO): Promise<Order | HttpException> {
        try{
            let order = this.orderRepository.create(body)
            await this.orderRepository.save(order);
           
            return order;
        }catch (error) {
            throw new BadRequestException("Order not created due to bad request data")
        }
    }

    async update(id: number, body: UpdateOrderDTO){
        try{
            let order = await this.orderRepository.findOneBy({id});
            
            if(!order) return new NotFoundException(`Order with id- ${id} was not found`).getResponse();

            let filtered_body = Object.fromEntries(
                Object.entries(body).filter(([key, value]) => value !== undefined)
            );

            Object.assign(order, filtered_body)

            await this.orderRepository.save(order);
            return order
        }
        catch(error){
            throw new BadRequestException("Order not updated due to bad request data")
        }
    }

    async delete(id: number) {
        const order = await this.orderRepository.findOneBy({id});

        if(!order) throw new NotFoundException(`Order with id- ${id} was not found`)
        await this.orderRepository.remove(order);

        return order;
    }
}