import { BadRequestException, HttpException, NotFoundException } from "@nestjs/common";
import { Injectable } from "@nestjs/common/decorators";
import { InjectRepository } from "@nestjs/typeorm";
import { APIFeatures } from "src/dto/apiFeatures.dto";
import { CreateReviewDTO } from "src/dto/create_review.dto";
import { UpdateReviewDTO } from "src/dto/update_review.dto";
import { Repository } from "typeorm";
import { Review } from "./review.entity";

@Injectable()
export class ReviewService{
    constructor(
        @InjectRepository(Review)
        private reviewRepository: Repository<Review>
    ) {}

    async getAll(query: APIFeatures, ): Promise<Review[]> {
        let { page= 1, limit= 10 } = query;
        page *= 1;
        limit *= 1;
        return await this.reviewRepository
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

    async getById(id: number): Promise<Review | HttpException> {
        let Review =await this.reviewRepository.findOneBy({id})

        if(!Review) throw new NotFoundException(`Review with id- ${id} was not found in the database`);

        return Review;
    }

    async create(body: CreateReviewDTO): Promise<Review | HttpException> {
        try{
            let review = this.reviewRepository.create(body)
            await this.reviewRepository.save(review);
           
            return review;
        }catch (error) {
            throw new BadRequestException("Review not created due to bad request data")
        }
    }

    async update(id: number, body: UpdateReviewDTO){
        try{
            let review = await this.reviewRepository.findOneBy({id});
            
            if(!review) return new NotFoundException(`Review with id- ${id} was not found`).getResponse();

            let filtered_body = Object.fromEntries(
                Object.entries(body).filter(([key, value]) => value !== undefined)
            );

            Object.assign(Review, filtered_body)

            await this.reviewRepository.save(Review);
            return Review
        }
        catch(error){
            throw new BadRequestException("Review not updated due to bad request data")
        }
    }

    async delete(id: number) {
        const review = await this.reviewRepository.findOneBy({id});

        if(!review) throw new NotFoundException(`Review with id- ${id} was not found`)
        await this.reviewRepository.remove(review);

        return review;
    }
}