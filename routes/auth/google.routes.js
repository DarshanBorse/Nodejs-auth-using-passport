import passport from "passport"
import '../../utils/passport.google';

const GoogleRoutes = (app) => {
    app.route(`/api/user/google`)
        //Register & Login
        .get(passport.authenticate('google', { scope: ['profile', "email"] }));

    app.route('/google')
        .get(passport.authenticate('google', {
            failureMessage: 'Cannot login to Google, Please try again',
            failureRedirect: '/fail',
            successRedirect: '/'
        }), (req, res) => {
            console.log(req.token);
            return res.send("Thank you for signing in");
        });
}

export default GoogleRoutes;