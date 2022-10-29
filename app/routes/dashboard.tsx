import { Form, Link, NavLink, Outlet } from "@remix-run/react";
import { useUser } from "~/utils";

export default function DashboardPage() {
  const user = useUser();

  return (
    <div className="flex h-full min-h-screen flex-col">
      <header className="flex items-center justify-between bg-slate-800 p-4 text-white">
        <h1 className="text-3xl font-bold">
          <Link to=".">Roaml</Link>
        </h1>
        <p>{user.email}</p>
        <Form action="/logout" method="post">
          <button
            type="submit"
            className="rounded bg-slate-600 py-2 px-4 text-blue-100 hover:bg-blue-500 active:bg-blue-600"
          >
            Logout
          </button>
        </Form>
      </header>

      <main className="flex h-full bg-white">
        <div className="h-full w-80 border-r bg-gray-50">
          <NavLink
            to="/dashboard"
            className={({ isActive }) =>
              `block px-4 py-2 transition-colors hover:bg-gray-100 text-blue-500${
                isActive ? ` bg-gray-100 font-semibold` : ""
              }`
            }
            end
          >
            Dashboard
          </NavLink>
          <NavLink
            to="posts"
            className={({ isActive }) =>
              `block px-4 py-2 transition-colors hover:bg-gray-100 text-blue-500${
                isActive ? ` bg-gray-100 font-semibold` : ""
              }`
            }
          >
            Posts
          </NavLink>
          <NavLink
            to="settings"
            className={({ isActive }) =>
              `block px-4 py-2 transition-colors hover:bg-gray-100 text-blue-500${
                isActive ? ` bg-gray-100 font-semibold` : ""
              }`
            }
          >
            Settings
          </NavLink>
        </div>

        <div className="flex-1 p-6">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
