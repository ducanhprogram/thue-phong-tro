const { User, Post } = require("@/models");
const { hashPassword, comparePassword } = require("@/utils/bcrypt");
require("dotenv").config();

const chothuecanho = require("../../data/chothuecanho.json");
const dataBody = chothuecanho.body;

class InsertService {
    async insertService() {
        try {
            for (const item of dataBody) {
                await Post.create({
                    title: item?.header?.title,
                    star: item?.header?.star,
                });
            }
        } catch (error) {
            throw error;
        }
    }
}

const insertService = new InsertService();
module.exports = insertService;
