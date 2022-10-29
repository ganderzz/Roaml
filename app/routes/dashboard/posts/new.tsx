import * as React from "react";
import type { ActionArgs } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { Form, useActionData, useSubmit } from "@remix-run/react";

import { createPost } from "~/models/post.server";
import { requireUserId } from "~/session.server";
import { Editor } from "~/models/editor";
import { Descendant } from "slate";
import { Button } from "~/components/button";

export async function action({ request }: ActionArgs) {
  const userId = await requireUserId(request);

  const formData = await request.formData();
  const title = formData.get("title");
  const body = formData.get("body");

  if (typeof title !== "string" || title.length === 0) {
    return json(
      { errors: { title: "Title is required", body: null } },
      { status: 400 }
    );
  }

  if (typeof body !== "string" || body.length === 0) {
    return json(
      { errors: { title: null, body: "Body is required" } },
      { status: 400 }
    );
  }

  const { id } = await createPost({ title, body, userId });

  return redirect(`/dashboard/posts/${id}`);
}

export default function NewPostPage() {
  const submit = useSubmit();
  const actionData = useActionData<typeof action>();
  const titleRef = React.useRef<HTMLInputElement>(null);
  const [text, setText] = React.useState("");

  const handleBodyChange = (value: Descendant[]) => {
    setText(JSON.stringify(value));
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    (e.currentTarget.dataset as any).append("body", text);
    submit(e.currentTarget, { action: "post" });
  };

  React.useEffect(() => {
    if (actionData?.errors?.title) {
      titleRef.current?.focus();
    }
  }, [actionData]);

  return (
    <Form
      method="post"
      className="mx-auto flex h-full w-1/2 flex-col gap-2"
      onSubmit={handleSubmit}
    >
      <div className="text-right">
        <Button type="submit" buttonType="primary">
          Save
        </Button>
      </div>

      <hr className="mb-4" />

      <div>
        <label className="flex w-full flex-row items-center gap-1">
          <input
            ref={titleRef}
            name="title"
            className="flex-1 rounded-md border-0 border-blue-500 text-lg leading-loose"
            placeholder="Enter Title..."
            aria-invalid={actionData?.errors?.title ? true : undefined}
            aria-errormessage={
              actionData?.errors?.title ? "title-error" : undefined
            }
          />
        </label>
        {actionData?.errors?.title && (
          <div className="pt-1 text-red-700" id="title-error">
            {actionData.errors.title}
          </div>
        )}
      </div>

      <div className="h-full">
        <label className="flex h-full w-full flex-col gap-1">
          <input type="hidden" name="body" value={text} />
          <Editor onChange={handleBodyChange} />
        </label>
        {actionData?.errors?.body && (
          <div className="pt-1 text-red-700" id="body-error">
            {actionData.errors.body}
          </div>
        )}
      </div>
    </Form>
  );
}
