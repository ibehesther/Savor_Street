import { MigrationInterface, QueryRunner } from "typeorm";

export class MakeDescriptionLongText1678069814342 implements MigrationInterface {
    name = 'MakeDescriptionLongText1678069814342'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`menu_items\` DROP COLUMN \`description\``);
        await queryRunner.query(`ALTER TABLE \`menu_items\` ADD \`description\` longtext NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`menu_items\` DROP COLUMN \`description\``);
        await queryRunner.query(`ALTER TABLE \`menu_items\` ADD \`description\` varchar(255) NOT NULL`);
    }

}
