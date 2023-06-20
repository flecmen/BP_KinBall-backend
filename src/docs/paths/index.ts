import authPaths from "./auth-paths";
import eventPaths from "./event-paths";
import groupPaths from "./group-paths";
import staticPaths from "./static-paths";
import userPaths from "./user-paths";

const paths = {
    ...authPaths,
    ...eventPaths,
    ...userPaths,
    ...groupPaths,
    ...staticPaths,
}

export default paths;