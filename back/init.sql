-- MySQL Workbench Forward Engineering

SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0;
SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0;
SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION';

-- -----------------------------------------------------
-- Schema samoim
-- -----------------------------------------------------

-- -----------------------------------------------------
-- Schema samoim
-- -----------------------------------------------------
CREATE SCHEMA IF NOT EXISTS `samoim` DEFAULT CHARACTER SET utf8 ;
USE `samoim` ;

-- -----------------------------------------------------
-- Table `samoim`.`users`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `samoim`.`users` ;

CREATE TABLE IF NOT EXISTS `samoim`.`users` (
  `id` INT(11) NOT NULL AUTO_INCREMENT,
  `email` VARCHAR(100) NOT NULL,
  `platform_type` VARCHAR(10) NULL DEFAULT NULL,
  `password` LONGTEXT NULL DEFAULT NULL,
  `name` VARCHAR(45) NULL DEFAULT NULL,
  `nickname` VARCHAR(45) NOT NULL,
  `gender` VARCHAR(1) NULL DEFAULT NULL,
  `auth` INT(11) NULL DEFAULT NULL,
  `phone` VARCHAR(45) NULL DEFAULT NULL,
  `about` VARCHAR(150) NULL DEFAULT NULL,
  `profile_url` VARCHAR(100) NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE INDEX `nickname_UNIQUE` (`nickname` ASC),
  UNIQUE INDEX `email_UNIQUE` (`email` ASC, `platform_type` ASC))
ENGINE = InnoDB
AUTO_INCREMENT = 3
DEFAULT CHARACTER SET = utf8;


-- -----------------------------------------------------
-- Table `samoim`.`alarms`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `samoim`.`alarms` ;

CREATE TABLE IF NOT EXISTS `samoim`.`alarms` (
  `id` INT(11) NOT NULL AUTO_INCREMENT,
  `from` INT(11) NOT NULL,
  `to` INT(11) NOT NULL,
  `content` TEXT NOT NULL,
  `title` TEXT NOT NULL,
  `created_date` DATETIME NULL DEFAULT NULL,
  `check` TINYINT(4) NULL DEFAULT '0',
  PRIMARY KEY (`id`),
  INDEX `fk_alarms_users1_idx` (`from` ASC),
  INDEX `fk_alarms_users2_idx` (`to` ASC),
  CONSTRAINT `fk_alarms_users1`
    FOREIGN KEY (`from`)
    REFERENCES `samoim`.`users` (`id`)
    ON DELETE CASCADE
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_alarms_users2`
    FOREIGN KEY (`to`)
    REFERENCES `samoim`.`users` (`id`)
    ON DELETE CASCADE
    ON UPDATE NO ACTION)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8;


-- -----------------------------------------------------
-- Table `samoim`.`major_classes`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `samoim`.`major_classes` ;

CREATE TABLE IF NOT EXISTS `samoim`.`major_classes` (
  `id` INT(11) NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(45) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE INDEX `name_UNIQUE` (`name` ASC))
ENGINE = InnoDB
AUTO_INCREMENT = 3
DEFAULT CHARACTER SET = utf8;


-- -----------------------------------------------------
-- Table `samoim`.`minor_classes`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `samoim`.`minor_classes` ;

CREATE TABLE IF NOT EXISTS `samoim`.`minor_classes` (
  `id` INT(11) NOT NULL AUTO_INCREMENT,
  `major_class_id` INT(11) NOT NULL,
  `name` VARCHAR(45) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE INDEX `name_UNIQUE` (`name` ASC),
  UNIQUE INDEX `id_UNIQUE` (`id` ASC),
  INDEX `fk_minor_classes_major_classes1_idx` (`major_class_id` ASC),
  CONSTRAINT `fk_minor_classes_major_classes1`
    FOREIGN KEY (`major_class_id`)
    REFERENCES `samoim`.`major_classes` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB
AUTO_INCREMENT = 8
DEFAULT CHARACTER SET = utf8;


-- -----------------------------------------------------
-- Table `samoim`.`studies`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `samoim`.`studies` ;

CREATE TABLE IF NOT EXISTS `samoim`.`studies` (
  `id` INT(11) NOT NULL AUTO_INCREMENT,
  `minor_class_id` INT(11) NULL DEFAULT NULL,
  `captain` INT(11) NOT NULL,
  `name` VARCHAR(45) NOT NULL,
  `goal` VARCHAR(45) NULL DEFAULT NULL,
  `description` LONGTEXT NOT NULL,
  `user_limit` INT(11) NULL DEFAULT NULL,
  `start_time` INT(11) NULL DEFAULT NULL,
  `end_time` INT(11) NULL DEFAULT NULL,
  `status` VARCHAR(45) NULL DEFAULT NULL,
  `start_date` DATE NULL DEFAULT NULL,
  `isopen` TINYINT(4) NULL DEFAULT NULL,
  `created_date` DATETIME NULL DEFAULT NULL,
  `end_date` DATETIME NULL DEFAULT NULL,
  `image_url` VARCHAR(100) NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE INDEX `name_UNIQUE` (`name` ASC),
  INDEX `fk_STUDIES_minor_classes1_idx` (`minor_class_id` ASC),
  INDEX `fk_studies_users1_idx` (`captain` ASC),
  CONSTRAINT `fk_STUDIES_minor_classes1`
    FOREIGN KEY (`minor_class_id`)
    REFERENCES `samoim`.`minor_classes` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_studies_users1`
    FOREIGN KEY (`captain`)
    REFERENCES `samoim`.`users` (`id`)
    ON DELETE CASCADE
    ON UPDATE NO ACTION)
ENGINE = InnoDB
AUTO_INCREMENT = 2
DEFAULT CHARACTER SET = utf8;


-- -----------------------------------------------------
-- Table `samoim`.`applies`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `samoim`.`applies` ;

CREATE TABLE IF NOT EXISTS `samoim`.`applies` (
  `id` INT(11) NOT NULL AUTO_INCREMENT,
  `study_id` INT(11) NOT NULL,
  `user_id` INT(11) NOT NULL,
  `comment` LONGTEXT NOT NULL,
  PRIMARY KEY (`id`),
  INDEX `fk_applies_STUDIES1_idx` (`study_id` ASC),
  INDEX `fk_applies_USERS1_idx` (`user_id` ASC),
  CONSTRAINT `fk_applies_STUDIES1`
    FOREIGN KEY (`study_id`)
    REFERENCES `samoim`.`studies` (`id`)
    ON DELETE CASCADE
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_applies_USERS1`
    FOREIGN KEY (`user_id`)
    REFERENCES `samoim`.`users` (`id`)
    ON DELETE CASCADE
    ON UPDATE NO ACTION)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8;


-- -----------------------------------------------------
-- Table `samoim`.`common_posts`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `samoim`.`common_posts` ;

CREATE TABLE IF NOT EXISTS `samoim`.`common_posts` (
  `id` INT(11) NOT NULL AUTO_INCREMENT,
  `writer` INT(11) NOT NULL,
  `title` TEXT NOT NULL,
  `content` LONGTEXT NOT NULL,
  `created_date` DATETIME NULL DEFAULT NULL,
  `view` INT(11) NOT NULL DEFAULT '0',
  `board` VARCHAR(45) NOT NULL,
  PRIMARY KEY (`id`),
  INDEX `fk_study_posts_USERS1_idx` (`writer` ASC),
  CONSTRAINT `fk_study_posts_USERS10`
    FOREIGN KEY (`writer`)
    REFERENCES `samoim`.`users` (`id`)
    ON DELETE CASCADE
    ON UPDATE NO ACTION)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8;


-- -----------------------------------------------------
-- Table `samoim`.`common_comments`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `samoim`.`common_comments` ;

CREATE TABLE IF NOT EXISTS `samoim`.`common_comments` (
  `id` INT(11) NOT NULL AUTO_INCREMENT,
  `writer` INT(11) NOT NULL,
  `post_id` INT(11) NOT NULL,
  `content` TEXT NOT NULL,
  `created_date` DATETIME NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  INDEX `fk_comments_USERS1_idx` (`writer` ASC),
  INDEX `fk_common_comments_common_posts1_idx` (`post_id` ASC),
  CONSTRAINT `fk_comments_USERS10`
    FOREIGN KEY (`writer`)
    REFERENCES `samoim`.`users` (`id`)
    ON DELETE CASCADE
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_common_comments_common_posts1`
    FOREIGN KEY (`post_id`)
    REFERENCES `samoim`.`common_posts` (`id`)
    ON DELETE CASCADE
    ON UPDATE NO ACTION)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8;


-- -----------------------------------------------------
-- Table `samoim`.`common_comment_likes`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `samoim`.`common_comment_likes` ;

CREATE TABLE IF NOT EXISTS `samoim`.`common_comment_likes` (
  `id` INT(11) NOT NULL AUTO_INCREMENT,
  `comment_id` INT(11) NOT NULL,
  `users_id` INT(11) NOT NULL,
  PRIMARY KEY (`id`),
  INDEX `fk_common_comments_has_users_users1_idx` (`users_id` ASC),
  INDEX `fk_common_comments_has_users_common_comments1_idx` (`comment_id` ASC),
  CONSTRAINT `fk_common_comments_has_users_common_comments1`
    FOREIGN KEY (`comment_id`)
    REFERENCES `samoim`.`common_comments` (`id`)
    ON DELETE CASCADE
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_common_comments_has_users_users1`
    FOREIGN KEY (`users_id`)
    REFERENCES `samoim`.`users` (`id`)
    ON DELETE CASCADE
    ON UPDATE NO ACTION)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8;


-- -----------------------------------------------------
-- Table `samoim`.`common_post_likes`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `samoim`.`common_post_likes` ;

CREATE TABLE IF NOT EXISTS `samoim`.`common_post_likes` (
  `id` INT(11) NOT NULL AUTO_INCREMENT,
  `common_post_id` INT(11) NOT NULL,
  `user_id` INT(11) NOT NULL,
  PRIMARY KEY (`id`),
  INDEX `fk_common_posts_has_USERS_USERS1_idx` (`user_id` ASC),
  INDEX `fk_common_posts_has_USERS_common_posts1_idx` (`common_post_id` ASC),
  CONSTRAINT `fk_common_posts_has_USERS_USERS1`
    FOREIGN KEY (`user_id`)
    REFERENCES `samoim`.`users` (`id`)
    ON DELETE CASCADE
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_common_posts_has_USERS_common_posts1`
    FOREIGN KEY (`common_post_id`)
    REFERENCES `samoim`.`common_posts` (`id`)
    ON DELETE CASCADE
    ON UPDATE NO ACTION)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8;


-- -----------------------------------------------------
-- Table `samoim`.`days`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `samoim`.`days` ;

CREATE TABLE IF NOT EXISTS `samoim`.`days` (
  `id` INT(11) NOT NULL AUTO_INCREMENT,
  `study_id` INT(11) NOT NULL,
  `day` VARCHAR(3) NOT NULL,
  PRIMARY KEY (`id`),
  INDEX `fk_days_STUDIES1_idx` (`study_id` ASC),
  CONSTRAINT `fk_days_STUDIES1`
    FOREIGN KEY (`study_id`)
    REFERENCES `samoim`.`studies` (`id`)
    ON DELETE CASCADE
    ON UPDATE NO ACTION)
ENGINE = InnoDB
AUTO_INCREMENT = 3
DEFAULT CHARACTER SET = utf8;


-- -----------------------------------------------------
-- Table `samoim`.`marked_studies`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `samoim`.`marked_studies` ;

CREATE TABLE IF NOT EXISTS `samoim`.`marked_studies` (
  `id` INT(11) NOT NULL AUTO_INCREMENT,
  `user_id` INT(11) NOT NULL,
  `study_id` INT(11) NOT NULL,
  PRIMARY KEY (`id`),
  INDEX `fk_users_has_studies_studies1_idx` (`study_id` ASC),
  INDEX `fk_users_has_studies_users1_idx` (`user_id` ASC),
  CONSTRAINT `fk_marked_studies_studies`
    FOREIGN KEY (`study_id`)
    REFERENCES `samoim`.`studies` (`id`)
    ON DELETE CASCADE
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_marked_studies_users`
    FOREIGN KEY (`user_id`)
    REFERENCES `samoim`.`users` (`id`)
    ON DELETE CASCADE
    ON UPDATE NO ACTION)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8;


-- -----------------------------------------------------
-- Table `samoim`.`personal_works`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `samoim`.`personal_works` ;

CREATE TABLE IF NOT EXISTS `samoim`.`personal_works` (
  `id` INT(11) NOT NULL AUTO_INCREMENT,
  `writer` INT(11) NOT NULL,
  `study_id` INT(11) NULL DEFAULT NULL,
  `start_date` DATE NOT NULL,
  `end_date` DATE NOT NULL,
  `content` LONGTEXT NOT NULL,
  `status` VARCHAR(45) NOT NULL,
  PRIMARY KEY (`id`),
  INDEX `fk_works_USERS1_idx` (`writer` ASC),
  INDEX `fk_works_STUDIES1_idx` (`study_id` ASC),
  CONSTRAINT `fk_works_STUDIES10`
    FOREIGN KEY (`study_id`)
    REFERENCES `samoim`.`studies` (`id`)
    ON DELETE CASCADE
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_works_USERS10`
    FOREIGN KEY (`writer`)
    REFERENCES `samoim`.`users` (`id`)
    ON DELETE CASCADE
    ON UPDATE NO ACTION)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8;


-- -----------------------------------------------------
-- Table `samoim`.`tags`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `samoim`.`tags` ;

CREATE TABLE IF NOT EXISTS `samoim`.`tags` (
  `id` INT(11) NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(45) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE INDEX `name_UNIQUE` (`name` ASC))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8;


-- -----------------------------------------------------
-- Table `samoim`.`studies_and_tags`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `samoim`.`studies_and_tags` ;

CREATE TABLE IF NOT EXISTS `samoim`.`studies_and_tags` (
  `id` INT(11) NOT NULL AUTO_INCREMENT,
  `study_id` INT(11) NOT NULL,
  `tag_id` INT(11) NOT NULL,
  PRIMARY KEY (`id`),
  INDEX `fk_STUDIES_has_tags_tags1_idx` (`tag_id` ASC),
  INDEX `fk_STUDIES_has_tags_STUDIES1_idx` (`study_id` ASC),
  CONSTRAINT `fk_STUDIES_has_tags_STUDIES1`
    FOREIGN KEY (`study_id`)
    REFERENCES `samoim`.`studies` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_STUDIES_has_tags_tags1`
    FOREIGN KEY (`tag_id`)
    REFERENCES `samoim`.`tags` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8;


-- -----------------------------------------------------
-- Table `samoim`.`study_posts`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `samoim`.`study_posts` ;

CREATE TABLE IF NOT EXISTS `samoim`.`study_posts` (
  `id` INT(11) NOT NULL AUTO_INCREMENT,
  `writer` INT(11) NOT NULL,
  `study_id` INT(11) NOT NULL,
  `title` TEXT NOT NULL,
  `content` LONGTEXT NOT NULL,
  `created_date` DATETIME NULL DEFAULT NULL,
  `view` INT(11) NOT NULL DEFAULT '0',
  `board` VARCHAR(45) NOT NULL,
  PRIMARY KEY (`id`),
  INDEX `fk_study_posts_USERS1_idx` (`writer` ASC),
  INDEX `fk_study_posts_studies1_idx` (`study_id` ASC),
  CONSTRAINT `fk_study_posts_USERS1`
    FOREIGN KEY (`writer`)
    REFERENCES `samoim`.`users` (`id`)
    ON DELETE CASCADE
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_study_posts_studies1`
    FOREIGN KEY (`study_id`)
    REFERENCES `samoim`.`studies` (`id`)
    ON DELETE CASCADE
    ON UPDATE NO ACTION)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8;


-- -----------------------------------------------------
-- Table `samoim`.`study_comments`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `samoim`.`study_comments` ;

CREATE TABLE IF NOT EXISTS `samoim`.`study_comments` (
  `id` INT(11) NOT NULL AUTO_INCREMENT,
  `writer` INT(11) NOT NULL,
  `post_id` INT(11) NOT NULL,
  `content` TEXT NOT NULL,
  `created_date` DATETIME NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  INDEX `fk_study_comments_users1_idx` (`writer` ASC),
  INDEX `fk_study_comments_study_posts1_idx` (`post_id` ASC),
  CONSTRAINT `fk_study_comments_study_posts1`
    FOREIGN KEY (`post_id`)
    REFERENCES `samoim`.`study_posts` (`id`)
    ON DELETE CASCADE
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_study_comments_users1`
    FOREIGN KEY (`writer`)
    REFERENCES `samoim`.`users` (`id`)
    ON DELETE CASCADE
    ON UPDATE NO ACTION)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8;


-- -----------------------------------------------------
-- Table `samoim`.`study_comment_likes`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `samoim`.`study_comment_likes` ;

CREATE TABLE IF NOT EXISTS `samoim`.`study_comment_likes` (
  `id` INT(11) NOT NULL AUTO_INCREMENT,
  `comment_id` INT(11) NOT NULL,
  `user_id` INT(11) NOT NULL,
  PRIMARY KEY (`id`),
  INDEX `fk_study_comments_has_users_users1_idx` (`user_id` ASC),
  INDEX `fk_study_comments_has_users_study_comments1_idx` (`comment_id` ASC),
  CONSTRAINT `fk_study_comments_has_users_study_comments1`
    FOREIGN KEY (`comment_id`)
    REFERENCES `samoim`.`study_comments` (`id`)
    ON DELETE CASCADE
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_study_comments_has_users_users1`
    FOREIGN KEY (`user_id`)
    REFERENCES `samoim`.`users` (`id`)
    ON DELETE CASCADE
    ON UPDATE NO ACTION)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8;


-- -----------------------------------------------------
-- Table `samoim`.`study_post_likes`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `samoim`.`study_post_likes` ;

CREATE TABLE IF NOT EXISTS `samoim`.`study_post_likes` (
  `study_post_id` INT(11) NOT NULL,
  `user_id` INT(11) NOT NULL,
  `id` INT(11) NOT NULL AUTO_INCREMENT,
  PRIMARY KEY (`id`),
  INDEX `fk_study_posts_has_USERS_USERS1_idx` (`user_id` ASC),
  INDEX `fk_study_posts_has_USERS_study_posts1_idx` (`study_post_id` ASC),
  CONSTRAINT `fk_study_posts_has_USERS_USERS1`
    FOREIGN KEY (`user_id`)
    REFERENCES `samoim`.`users` (`id`)
    ON DELETE CASCADE
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_study_posts_has_USERS_study_posts1`
    FOREIGN KEY (`study_post_id`)
    REFERENCES `samoim`.`study_posts` (`id`)
    ON DELETE CASCADE
    ON UPDATE NO ACTION)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8;


-- -----------------------------------------------------
-- Table `samoim`.`study_works`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `samoim`.`study_works` ;

CREATE TABLE IF NOT EXISTS `samoim`.`study_works` (
  `id` INT(11) NOT NULL AUTO_INCREMENT,
  `writer` INT(11) NOT NULL,
  `study_id` INT(11) NOT NULL,
  `start_date` DATE NOT NULL,
  `end_date` DATE NOT NULL,
  `content` LONGTEXT NOT NULL,
  `status` VARCHAR(45) NOT NULL,
  PRIMARY KEY (`id`),
  INDEX `fk_study_works_users1_idx` (`writer` ASC),
  INDEX `fk_study_works_studies1_idx` (`study_id` ASC),
  CONSTRAINT `fk_study_works_studies1`
    FOREIGN KEY (`study_id`)
    REFERENCES `samoim`.`studies` (`id`)
    ON DELETE CASCADE
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_study_works_users1`
    FOREIGN KEY (`writer`)
    REFERENCES `samoim`.`users` (`id`)
    ON DELETE CASCADE
    ON UPDATE NO ACTION)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8;


-- -----------------------------------------------------
-- Table `samoim`.`users_and_minor_classes`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `samoim`.`users_and_minor_classes` ;

CREATE TABLE IF NOT EXISTS `samoim`.`users_and_minor_classes` (
  `id` INT(11) NOT NULL AUTO_INCREMENT,
  `minor_classes_id` INT(11) NOT NULL,
  `users_id` INT(11) NOT NULL,
  PRIMARY KEY (`id`),
  INDEX `fk_minor_classes_has_users_users1_idx` (`users_id` ASC),
  INDEX `fk_minor_classes_has_users_minor_classes1_idx` (`minor_classes_id` ASC),
  CONSTRAINT `fk_minor_classes_has_users_minor_classes1`
    FOREIGN KEY (`minor_classes_id`)
    REFERENCES `samoim`.`minor_classes` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_minor_classes_has_users_users1`
    FOREIGN KEY (`users_id`)
    REFERENCES `samoim`.`users` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8;


-- -----------------------------------------------------
-- Table `samoim`.`users_and_studies`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `samoim`.`users_and_studies` ;

CREATE TABLE IF NOT EXISTS `samoim`.`users_and_studies` (
  `id` INT(11) NOT NULL AUTO_INCREMENT,
  `user_id` INT(11) NOT NULL,
  `study_id` INT(11) NOT NULL,
  `level` VARCHAR(45) NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  INDEX `fk_USERS_has_STUDIES_STUDIES1_idx` (`study_id` ASC),
  INDEX `fk_USERS_has_STUDIES_USERS_idx` (`user_id` ASC),
  CONSTRAINT `fk_USERS_has_STUDIES_STUDIES1`
    FOREIGN KEY (`study_id`)
    REFERENCES `samoim`.`studies` (`id`)
    ON DELETE CASCADE
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_USERS_has_STUDIES_USERS`
    FOREIGN KEY (`user_id`)
    REFERENCES `samoim`.`users` (`id`)
    ON DELETE CASCADE
    ON UPDATE NO ACTION)
ENGINE = InnoDB
AUTO_INCREMENT = 2
DEFAULT CHARACTER SET = utf8;


SET SQL_MODE=@OLD_SQL_MODE;
SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;
SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS;

