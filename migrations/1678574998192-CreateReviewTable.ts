import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateReviewTable1678574998192 implements MigrationInterface {
    name = 'CreateReviewTable1678574998192'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`reviews\` (\`id\` int NOT NULL AUTO_INCREMENT, \`user_id\` varchar(255) NOT NULL, \`rating\` enum ('1', '2', '3', '4', '5') NOT NULL, \`review\` varchar(255) NOT NULL, \`review_date_time\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE \`reviews\``);
    }

}
