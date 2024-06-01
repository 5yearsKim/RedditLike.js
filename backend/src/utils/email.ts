import nodemailer from "nodemailer";
import { env } from "@/env";


export const transporter = nodemailer.createTransport({
  service: "gmail",
  host: "smtp.gmail.com",
  // port: 587,
  secure: false,
  auth: {
    // TODO: replace `user` and `pass` values from <https://forwardemail.net>
    user: env.GMAIL_MAIL,
    pass: env.GMAIL_PASS,
  },
});