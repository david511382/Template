-- CreateTable
CREATE TABLE `operation_record` (
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `username` VARCHAR(64) NOT NULL,
    `operator_code` TINYINT UNSIGNED NOT NULL,
    `operator_time` TIMESTAMP NOT NULL,
    `message` VARCHAR(255) NOT NULL,

    INDEX `operation_record_operator_time_idx`(`operator_time`),
    INDEX `operation_record_message_idx`(`message`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
