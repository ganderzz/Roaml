import { Link, useLoaderData } from "@remix-run/react";
import { LoaderArgs, redirect, json } from "@remix-run/server-runtime";
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

export const dateFormat = new Intl.DateTimeFormat("en", {
  timeStyle: "short",
  dateStyle: "short",
  timeZone: "UTC",
});

export default function PostsIndexPage() {
  const data = useLoaderData<typeof loader>();

  return (
    <div>
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Posts</h2>

        <Link
          to="new"
          className="rounded bg-blue-500 py-2 px-4 text-white hover:bg-blue-600 focus:bg-blue-400"
        >
          Create new post
        </Link>
      </div>

      <hr className="my-2" />

      <table className="w-full border-separate border-spacing-0 rounded-md border-2 border-gray-200">
        <thead>
          <tr className="bg-gray-100 font-bold text-gray-600">
            <td className="p-2">Title</td>
            <td className="p-2">Last Updated</td>
            <td className="p-2">Created On</td>
          </tr>
        </thead>

        <tbody>
          {!data?.posts?.length ? (
            <tr>
              <td colSpan={3}>You have no posts.</td>
            </tr>
          ) : (
            data.posts.map((post, i) => (
              <tr
                className={
                  data.posts.length - 1 !== i
                    ? "border-b-2 border-gray-200"
                    : ""
                }
              >
                <td className="p-2 py-4">
                  <Link
                    className="text-blue-400 underline hover:text-blue-600"
                    to={`/dashboard/posts/${post.id}`}
                  >
                    {post.title}
                  </Link>
                </td>

                <td className="p-2 py-4">
                  {dateFormat.format(new Date(post.updatedAt))}
                </td>
                <td className="p-2 py-4">
                  {dateFormat.format(new Date(post.createdAt))}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
