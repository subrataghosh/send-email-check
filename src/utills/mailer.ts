import { MAIL_SERVICE } from "@/constant/constant";
import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
    service: MAIL_SERVICE,
    auth: {
        user: process.env.EMAIL_USER as string,
        pass: process.env.EMAIL_PASS as string
    }
});

export default transporter;