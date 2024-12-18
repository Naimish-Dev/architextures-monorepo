export const emailVerificationConfig = {
  emailVerificationLinkExpiryInMS: 10 * 60 * 1000,
  emailVerificationLinkBasePath: (id, hash) =>
    `${process.env.APP_URL}/auth/verify-email/${id}/${hash}`,
  emailVerificationSuccessRedirectUrl: `${process.env.FRONTEND_URL}/verification-success`,
  emailVerificationFailedRedirectUrl: `${process.env.FRONTEND_URL}/verification-failed`,
};
