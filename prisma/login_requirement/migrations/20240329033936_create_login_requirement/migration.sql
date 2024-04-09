-- CreateTable
CREATE TABLE `login_requirement` (
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `username` VARCHAR(64) NOT NULL,
    `ip` CHAR(15) NOT NULL,
    `description` VARCHAR(128) NOT NULL,
    `request_time` TIMESTAMP NOT NULL,
    `request_date` TIMESTAMP NOT NULL,
    `apply_username` VARCHAR(64) NULL,
    `approval` TINYINT UNSIGNED NULL,
    `apply_time` TIMESTAMP NULL,
    `apply_date` TIMESTAMP NULL,

    INDEX `login_requirement_request_date_idx`(`request_date`),
    INDEX `login_requirement_username_idx`(`username`),
    INDEX `login_requirement_ip_idx`(`ip`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
