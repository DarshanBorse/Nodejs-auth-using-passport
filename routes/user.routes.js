import { creatUser } from "../controllers/user.controller";

const UserRoutes = (app) => {
    app.route(`/api/user/register`)
        // Create user 
        .post(creatUser)
}

export default UserRoutes;