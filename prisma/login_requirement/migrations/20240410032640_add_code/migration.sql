/*
  Warnings:

  - You are about to alter the column `request_time` on the `login_requirement` table. The data in that column could be lost. The data in that column will be cast from `Timestamp(0)` to `Timestamp`.
  - You are about to alter the column `request_date` on the `login_requirement` table. The data in that column could be lost. The data in that column will be cast from `Timestamp(0)` to `Timestamp`.
  - You are about to alter the column `apply_time` on the `login_requirement` table. The data in that column could be lost. The data in that column will be cast from `Timestamp(0)` to `Timestamp`.
  - You are about to alter the column `apply_date` on the `login_requirement` table. The data in that column could be lost. The data in that column will be cast from `Timestamp(0)` to `Timestamp`.
  - You are about to alter the column `connect_time` on the `login_requirement` table. The data in that column could be lost. The data in that column will be cast from `Timestamp(0)` to `Timestamp`.

*/
-- AlterTable
ALTER TABLE `login_requirement` ADD COLUMN `code` VARCHAR(15) NULL,
    MODIFY `request_time` TIMESTAMP NOT NULL,
    MODIFY `request_date` TIMESTAMP NOT NULL,
    MODIFY `apply_time` TIMESTAMP NULL,
    MODIFY `apply_date` TIMESTAMP NULL,
    MODIFY `connect_time` TIMESTAMP NOT NULL;
