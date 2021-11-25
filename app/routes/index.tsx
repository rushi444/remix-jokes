import type { MetaFunction } from "remix";

export let meta: MetaFunction = () => {
  return {
    title: "Remix Starter",
    description: "Welcome to remix!",
  };
};

// https://remix.run/guides/routing#index-routes
export default function Index() {
  return (
    <div>
      <h1>Hello World</h1>
    </div>
  );
}
