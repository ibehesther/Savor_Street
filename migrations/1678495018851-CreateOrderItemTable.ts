import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateOrderItemTable1678495018851 implements MigrationInterface {
    name = 'CreateOrderItemTable1678495018851'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`order_items\` (\`id\` int NOT NULL AUTO_INCREMENT, \`order_id\` int NOT NULL, \`item_id\` int NOT NULL, \`quantity\` int NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE \`order_items\``);
    }

}
