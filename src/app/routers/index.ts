import express from "express";
import { UsersRoutes } from "../modules/users/users.routers";
import { RoutesIProps } from "../interface";
import { PostsRoutes } from "../modules/posts/posts.routers";

const router = express.Router();

const moduleRoutes: RoutesIProps[] = [
	{
		path: "/users",
		route: UsersRoutes
	},
	{
		path: "/posts",
		route: PostsRoutes
	}
];

moduleRoutes.forEach((route) => router.use(route.path, route.route));

export default router;
