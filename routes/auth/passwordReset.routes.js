import { PasswordResetLink, PasswordResetToken } from "../../controllers/passwordReset.controller";

const PasswordResetRoute = (app) => {
    app.route('/api/user/passwordReset')
        .post(PasswordResetLink);

    app.route(`/api/password-reset/:userId/:token`)
        .post(PasswordResetToken);
}

export default PasswordResetRoute;