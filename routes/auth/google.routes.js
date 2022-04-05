import passport from "passport"
import '../../utils/passport.google';

const GoogleRoutes = (app) => {
    app.route(`/api/user/google`)
        //Register & Login
        .get(passport.authenticate('google', { scope: ['profile', "email"] }));

    app.route('/google')
        .get(passport.authenticate('google', {
            successRedirect: '/',
            failureRedirect: '/auth/google/failure'
        }));
}

export default GoogleRoutes;