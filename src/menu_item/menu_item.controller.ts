import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, ParseIntPipe, Patch, Post, Query, Session, UsePipes, Req} from "@nestjs/common";
import { Request } from "express";
import { APIFeatures } from "src/dto/apiFeatures.dto";
import { CreateMenuItemDTO } from "src/dto/create_menu_item.dto";
import { UpdateMenuItemDTO } from "src/dto/update_menu_item.dto";
import { ValidationPipe } from "src/pipes/validation.pipe";
import { MenuItemService } from "./menu_item.service";


@Controller('menu')
export class MenuItemController {
    constructor(private readonly menuItemService: MenuItemService) {}

    @Get()
    async getAllMenuItems(@Session() session: Record<string, any>, @Query() query: APIFeatures ) {
        console.log(session)
        return await this.menuItemService.getAll(query)
    }

    @Get(":id")
    @HttpCode(HttpStatus.OK)
    async getMenuItemById(@Param('id', ParseIntPipe) id: number) {
        return await this.menuItemService.getById(id);
    }

    @Post()
    @UsePipes(new ValidationPipe())
    async createMenuItem(@Body() body: CreateMenuItemDTO) {
        return await this.menuItemService.create(body)
    }

    @Patch(':id')
    async updateMenuItem(@Param('id', ParseIntPipe) id: number, @Body(new ValidationPipe()) body: UpdateMenuItemDTO) {
        return await this.menuItemService.update(id, body);
    }

    @Delete(':id')
    async deleteMenuItem(@Param('id', ParseIntPipe) id: number){
        return await this.menuItemService.delete(id)
    }

}