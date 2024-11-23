export const passwordResetConfig = {
  passwordResetLinkFrontendUrl: (token, email) =>
    `${process.env.FRONTEND_URL}/auth/reset-password/${token}?email=${email}`,
};
