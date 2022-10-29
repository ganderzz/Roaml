import { Link, useLoaderData } from "@remix-run/react";
import { json, LoaderArgs, redirect } from "@remix-run/server-runtime";
import { getPosts } from "~/models/post.server";
import { getUserId } from "~/session.server";

export async function loader({ request, params }: LoaderArgs) {
  const userId = await getUserId(request);

  if (!userId) {
    return redirect(`/`);
  }

  const posts = await getPosts({ userId });
  return json({ posts });
}

export default function DashboardIndexPage() {
  const { posts } = useLoaderData<typeof loader>();

  return <div>You have {posts.length} posts.</div>;
}
