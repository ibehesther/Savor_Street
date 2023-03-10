import { BadRequestException, HttpException, Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { APIFeatures } from "src/dto/apiFeatures.dto";
import { CreateMenuItemDTO } from "src/dto/create_menu_item.dto";
import { UpdateMenuItemDTO } from "src/dto/update_menu_item.dto";
import { QueryFailedError, Repository } from "typeorm";
import { MenuItem } from "./menu_item.entity";

@Injectable()
export class MenuItemService{
    constructor(
        @InjectRepository(MenuItem)
        private menuItemRepository: Repository<MenuItem>
    ) {}

    async getAll(query: APIFeatures, ): Promise<MenuItem[]> {
        let { page= 1, limit= 10 } = query;
        page *= 1;
        limit *= 1;
        return await this.menuItemRepository.find({
            skip: (page - 1) * limit,
            take: limit,
            where: {

            },
            order: {
                name: "ASC"
            }
        })
    }

    async getById(id: number): Promise<MenuItem | HttpException> {
        let menuItem =await this.menuItemRepository.findOneBy({id})

        if(!menuItem) throw new NotFoundException(`Menu Item with id- ${id} was not found in the database`);

        return menuItem;
    }

    async create(body: CreateMenuItemDTO): Promise<MenuItem | HttpException> {
        try{
            let menuItem = this.menuItemRepository.create(body)
            await this.menuItemRepository.save(menuItem);
           
            return menuItem;
        }catch (error) {
            if (error instanceof QueryFailedError && error.driverError.code === 'ER_DUP_ENTRY') {
                throw new BadRequestException('Duplicate record');
            }
            throw new BadRequestException("Menu Item not created due to bad request data")
        }
    }

    async update(id: number, body: UpdateMenuItemDTO){
        try{
            let menu_item = await this.menuItemRepository.findOneBy({id});
            
            if(!menu_item) return new NotFoundException(`Menu item with id- ${id} was not found`).getResponse();

            let filtered_body = Object.fromEntries(
                Object.entries(body).filter(([key, value]) => value !== undefined)
            );

            Object.assign(menu_item, filtered_body)

            await this.menuItemRepository.save(menu_item);
            return menu_item
        }
        catch(error){
            if (error instanceof QueryFailedError && error.driverError.code === 'ER_DUP_ENTRY') {
                throw new BadRequestException('Duplicate record');
            }
            throw new BadRequestException("Menu Item not updated due to bad request data")
        }
    }

    async delete(id: number) {
        const menu_item = await this.menuItemRepository.findOneBy({id});

        if(!menu_item) throw new NotFoundException(`Menu item with id- ${id} was not found`)
        await this.menuItemRepository.remove(menu_item);


        return menu_item
    }
}