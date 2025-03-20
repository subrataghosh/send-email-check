import { NextApiRequest, NextApiResponse } from "next";
import Cors from "cors";

import { EmailRequest } from "../../types/mail";
import transporter from "@/utills/mailer";

// CORS configuration
const cors = Cors({ methods: ["POST", "OPTIONS"] });

// Middleware function for handling CORS
function runMiddleware(req: NextApiRequest, res: NextApiResponse, fn: (req: NextApiRequest, res: NextApiResponse, next: (result?: unknown) => void) => void) {
    return new Promise<void>((resolve, reject) => {
        fn(req, res, (result) => {
            if (result instanceof Error) {
                return reject(result);
            }
            return resolve();
        });
    });
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    await runMiddleware(req, res, cors);

    if (req.method !== "POST") {
        return res.status(405).json({ statusCode: 201, message: "Method Not Allowed" });
    }

    const { email, subject, body }: EmailRequest = req.body;

    if (!email) {
        return res.status(400).json({ statusCode: 202, message: "Email and OTP are required" });
    }

    try {
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: subject || "Subject",
            text:  body || "Body"
        };

        await transporter.sendMail(mailOptions);
        res.status(200).json({ statusCode: 200, message: "Email sent successfully!" });

    } catch (error: unknown) {
        console.error("Email error:", error);
        if (error instanceof Error) {
            return res.status(500).json({ message: "Failed to send email", error: error.message });
        }
    }
}
