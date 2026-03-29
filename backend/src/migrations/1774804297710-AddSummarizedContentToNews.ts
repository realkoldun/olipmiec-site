import { MigrationInterface, QueryRunner } from "typeorm";

export class AddSummarizedContentToNews1774804297710 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "news" 
            ADD COLUMN "summarizedContent" text
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "news" 
            DROP COLUMN "summarizedContent"
        `);
    }

}
