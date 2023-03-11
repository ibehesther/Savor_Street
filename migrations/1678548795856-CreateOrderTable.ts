import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateOrderTable1678548795856 implements MigrationInterface {
    name = 'CreateOrderTable1678548795856'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`orders\` (\`id\` int NOT NULL AUTO_INCREMENT, \`user_id\` varchar(255) NOT NULL, \`order_date_time\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`order_status\` enum ('pending', 'confirmed', 'cancelled') NOT NULL DEFAULT 'pending', \`payment_status\` enum ('pending', 'paid', 'refunded') NOT NULL DEFAULT 'pending', \`total_order_amount\` int NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE \`orders\``);
    }

}
