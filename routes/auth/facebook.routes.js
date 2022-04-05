import passport from "passport"
import '../../utils/passport.facebook';

const FacebookRoutes = (app) => {
    app.route(`/api/user/facebook`)
        //Register & Login
        .get(passport.authenticate('facebook', { scope: ['email'] }));

    app.route('/auth/facebook/callback')
        .get(passport.authenticate('facebook', {
            successRedirect: '/',
            failureRedirect: '/api/user/login'
        }));
}

export default FacebookRoutes;