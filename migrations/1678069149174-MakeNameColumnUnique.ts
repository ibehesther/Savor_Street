import { MigrationInterface, QueryRunner } from "typeorm";

export class MakeNameColumnUnique1678069149174 implements MigrationInterface {
    name = 'MakeNameColumnUnique1678069149174'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`menu_items\` ADD UNIQUE INDEX \`IDX_69bf08c96d8fada9f36f101216\` (\`name\`)`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`menu_items\` DROP INDEX \`IDX_69bf08c96d8fada9f36f101216\``);
    }

}
