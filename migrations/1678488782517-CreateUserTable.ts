import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateUserTable1678488782517 implements MigrationInterface {
    name = 'CreateUserTable1678488782517'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`users\` (\`id\` varchar(36) NOT NULL, \`browser\` varchar(255) NOT NULL, \`browser_version\` varchar(255) NOT NULL, \`os\` varchar(255) NOT NULL, \`os_version\` varchar(255) NOT NULL, UNIQUE INDEX \`IDX_6865c0f76705f3482f1d19316c\` (\`browser\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX \`IDX_6865c0f76705f3482f1d19316c\` ON \`users\``);
        await queryRunner.query(`DROP TABLE \`users\``);
    }

}
