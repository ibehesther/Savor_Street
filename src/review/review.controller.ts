import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, ParseIntPipe, Patch, Post, Query, UsePipes, } from "@nestjs/common";
import { APIFeatures } from "src/dto/apiFeatures.dto";
import { CreateReviewDTO } from "src/dto/create_review.dto";
import { UpdateReviewDTO } from "src/dto/update_review.dto";
import { ValidationPipe } from "src/pipes/validation.pipe";
import { ReviewService } from "./review.service";


@Controller('reviews')
export class ReviewController {
    constructor(private readonly reviewService: ReviewService) {}

    @Get()
    async getAllReviews(@Query() query: APIFeatures ) {
        return await this.reviewService.getAll(query)
    }

    @Get(":id")
    @HttpCode(HttpStatus.OK)
    async getReviewById(@Param('id', ParseIntPipe) id: number) {
        return await this.reviewService.getById(id);
    }

    @Post()
    @UsePipes(new ValidationPipe())
    async createReview(@Body() body: CreateReviewDTO) {
        return await this.reviewService.create(body)
    }

    @Patch(':id')
    async updateReview(@Param('id', ParseIntPipe) id: number, @Body(new ValidationPipe()) body: UpdateReviewDTO) {
        return await this.reviewService.update(id, body);
    }

    @Delete(':id')
    async deleteReview(@Param('id', ParseIntPipe) id: number){
        return await this.reviewService.delete(id)
    }

}