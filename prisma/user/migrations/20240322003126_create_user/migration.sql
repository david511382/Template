-- CreateTable
CREATE TABLE `user` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `first_name` VARCHAR(16) NOT NULL,
    `last_name` VARCHAR(16) NULL,
    `email` VARCHAR(128) NOT NULL,
    `password` CHAR(64) NOT NULL,
    `birthday` TIMESTAMP NULL,
    `gender` TINYINT UNSIGNED NULL,
    `utm_id` INTEGER NULL,

    UNIQUE INDEX `user_email_key`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `utm` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `campaign` VARCHAR(16) NOT NULL,
    `medium` VARCHAR(16) NOT NULL,
    `source` VARCHAR(16) NOT NULL,

    UNIQUE INDEX `utm_campaign_source_medium_key`(`campaign`, `source`, `medium`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `user` ADD CONSTRAINT `user_utm_id_fkey` FOREIGN KEY (`utm_id`) REFERENCES `utm`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
