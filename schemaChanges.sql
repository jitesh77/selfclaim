/**
 * @author Varun Kumar
 * Date: 23 April, 2018
 *
 * This file will contain all the MySql schema changes info-
 */

-- Date 23 April, 2018  Release Sequence- 
ALTER TABLE `insuranceInfos` ADD COLUMN `certificateNumber` VARCHAR(255) NULL DEFAULT NULL AFTER `employeeId`;
ALTER TABLE `ADDresses` ADD COLUMN `country` VARCHAR(255) NOT NULL DEFAULT 'India' AFTER `pin`;
ALTER TABLE `selfClaims` ADD COLUMN `country` VARCHAR(255) NOT NULL DEFAULT 'India' AFTER `progressLevel`;
ALTER TABLE `insurers` ADD COLUMN `countryJurisdiction` VARCHAR(255) NOT NULL DEFAULT 'India' AFTER `activeStatus`;
ALTER TABLE `tpas` ADD COLUMN `countryJurisdiction` VARCHAR(255) NOT NULL DEFAULT 'India' AFTER `activeStatus`;
ALTER TABLE `selfClaims` ADD COLUMN `nickName` VARCHAR(255) NULL AFTER `country`;

-- Date 24 April, 2018  Release Sequence- 
ALTER TABLE `users` ADD COLUMN `sourceId` INTEGER NULL AFTER `type`;
ALTER TABLE `users` ADD FOREIGN KEY (`sourceId`) references `sources` (`id`) ON DELETE SET NULL ON UPDATE SET NULL;
ALTER TABLE `users` ADD COLUMN `partnerAccountId` INTEGER NULL AFTER `sourceId`;
ALTER TABLE `users` ADD FOREIGN KEY (`partnerAccountId`) references `partnerAccounts` (`id`) ON DELETE SET NULL ON UPDATE SET NULL;

-- Date 1 May, 2018  Release Sequence-
ALTER TABLE `sources` CHANGE `type` `sourceType` VARCHAR(255);