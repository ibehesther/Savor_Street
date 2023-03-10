import { MigrationInterface, QueryRunner } from "typeorm";

export class RemoveUniqueConstraintFromBrowser1678490688628 implements MigrationInterface {
    name = 'RemoveUniqueConstraintFromBrowser1678490688628'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX \`IDX_6865c0f76705f3482f1d19316c\` ON \`users\``);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE UNIQUE INDEX \`IDX_6865c0f76705f3482f1d19316c\` ON \`users\` (\`browser\`)`);
    }

}
