export const passwordResetConfig = {
  passwordResetLinkFrontendUrl: (token, email) =>
    `${process.env.APP_URL}/reset-password?code=${token}&email=${email}`,
};
