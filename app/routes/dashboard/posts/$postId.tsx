import type { ActionArgs, LoaderArgs } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { Form, useCatch, useFormAction, useLoaderData } from "@remix-run/react";
import * as React from "react";
import { Editor } from "~/models/editor";
import invariant from "tiny-invariant";

import { deletePost, getPost } from "~/models/post.server";
import { requireUserId } from "~/session.server";
import { Button } from "~/components/button";

export async function loader({ request, params }: LoaderArgs) {
  const userId = await requireUserId(request);
  invariant(params.postId, "postId not found");

  const post = await getPost({ userId, id: params.postId });
  if (!post) {
    throw new Response("Not Found", { status: 404 });
  }
  return json({ post });
}

export async function action({ request, params }: ActionArgs) {
  const userId = await requireUserId(request);
  invariant(params.postId, "postId not found");

  if (request.method === "DELETE") {
    await deletePost({ userId, id: params.postId });

    return redirect("/dashboard/posts");
  }

  return json({ error: "Invalid request" }, { status: 400 });
}

export default function NoteDetailsPage() {
  const data = useLoaderData<typeof loader>();
  const body = React.useMemo(
    () => JSON.parse(data.post?.body),
    [data.post?.body]
  );

  const checkShouldDelete = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (!confirm(`Are you sure you want to delete ${data.post.title}?`)) {
      e.preventDefault();
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between">
        <h3 className="text-2xl font-bold">{data.post.title}</h3>

        <Form method="post" className="flex justify-end gap-1">
          <Button
            type="submit"
            buttonType="primary"
            name="edit"
            formAction={useFormAction("edit")}
            formMethod="POST"
          >
            Edit
          </Button>
          <Button
            type="submit"
            buttonType="error"
            name="delete"
            formMethod="DELETE"
            onClick={checkShouldDelete}
          >
            Delete
          </Button>
        </Form>
      </div>

      <hr className="my-4" />

      <div className="mx-auto w-1/2">
        <Editor initialValue={body} readOnly />
      </div>
    </div>
  );
}

export function ErrorBoundary({ error }: { error: Error }) {
  console.error(error);

  return <div>An unexpected error occurred: {error.message}</div>;
}

export function CatchBoundary() {
  const caught = useCatch();

  if (caught.status === 404) {
    return (
      <div>
        <h2 className="bold text-xl">😟 Post not found</h2>
      </div>
    );
  }

  throw new Error(`Unexpected caught response with status: ${caught.status}`);
}
