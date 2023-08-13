import { createTransport, SendMailOptions } from "nodemailer";

import { env } from "#core/config/env.config.js";

import { buildUrl, config, renderTemplate } from "./mail.service.utils.js";

const transporter = createTransport({
  host: env.MAIL_HOST,
  port: env.MAIL_PORT,
  auth: {
    user: env.MAIL_USER,
    pass: env.MAIL_PASSWORD,
  },
});

const mailService = {
  async sendMail(mailBody: SendMailOptions): Promise<boolean> {
    await transporter.sendMail(mailBody);
    return true;
  },

  async sendConfirmRegistrationMail(
    email: string,
    registrationToken: string,
  ): Promise<{ mailSent: boolean }> {
    const { mailConfigurations } = config;

    const url = buildUrl(env.FRONTEND_URL, {
      path: "/registration",
      query: {
        rt: registrationToken,
      },
    });

    const body = await renderTemplate({
      templateFile: mailConfigurations.confirmRegistration.templateFile,
      data: { url },
    });
    const { subject } = mailConfigurations.confirmRegistration;
    const mailPayload = {
      to: email,
      html: body,
      subject,
      from: env.MAIL_FROM,
    };

    return process.env.NODE_ENV === "development"
      ? ({ ...mailPayload, registrationToken } as any)
      : { mailSent: this.sendMail(mailPayload) };
  },
};

export default mailService;
