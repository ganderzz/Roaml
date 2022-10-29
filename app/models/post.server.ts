import type { User, Post } from "@prisma/client";
import { prisma } from "~/db.server";

export type { Post } from "@prisma/client";

export function getPost({
  id,
  userId,
}: Pick<Post, "id"> & {
  userId: User["id"];
}) {
  return prisma.post.findFirst({
    select: {
      id: true,
      body: true,
      title: true,
      createdAt: true,
      updatedAt: true,
      meta: true,
    },
    where: { id, userId },
  });
}

export function getPosts({ userId }: { userId: User["id"] }) {
  return prisma.post.findMany({
    where: { userId },
    select: {
      id: true,
      title: true,
      createdAt: true,
      updatedAt: true,
      meta: true,
    },
    orderBy: { createdAt: "desc" },
  });
}

export function createPost({
  body,
  title,
  userId,
}: Pick<Post, "body" | "title"> & {
  userId: User["id"];
}) {
  return prisma.post.create({
    data: {
      title,
      body,
      user: {
        connect: {
          id: userId,
        },
      },
    },
  });
}

export function deletePost({
  id,
  userId,
}: Pick<Post, "id"> & { userId: User["id"] }) {
  return prisma.post.deleteMany({
    where: { id, userId },
  });
}
