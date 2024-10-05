import nodemailer from "nodemailer"

const sendEmail = async (options) => {

    // 1. create a transporter
    const transporter = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        secure: false,
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        }
    })

    // 2. email options

    const mail = {
        from: "Sender Name <sender@example.com>",
        to: options.email,
        subject: options.subject,
        text: options.message,
        // html : "<p><b>Hello</b> to myself!</p>"

    }
    //3. send email
    await transporter.sendMail(mail)
}

export default sendEmail