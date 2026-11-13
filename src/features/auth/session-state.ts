/**
 * Tracks an intentional sign-out so the global 401 handler doesn't misreport it as an
 * expired session (queries still mounted during sign-out legitimately receive 401s).
 */
let signingOut = false;

export const sessionState = {
  get signingOut() {
    return signingOut;
  },
  beginSignOut() {
    signingOut = true;
  },
  reset() {
    signingOut = false;
  },
};
