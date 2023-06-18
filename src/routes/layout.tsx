import { component$, Slot, useStyles$ } from '@builder.io/qwik';
import { routeLoader$ } from '@builder.io/qwik-city';
import type { DocumentHead, RequestHandler } from '@builder.io/qwik-city';

import Header from '~/components/starter/header/header';
import Footer from '~/components/starter/footer/footer';

import styles from './styles.css?inline';

export const onGet: RequestHandler = async ({ cacheControl, cookie }) => {
  // cookieの取得
  console.log(cookie.getAll());

  // Control caching for this request for best performance and to reduce hosting costs:
  // https://qwik.builder.io/docs/caching/
  cacheControl({
    // Always serve a cached response by default, up to a week stale
    staleWhileRevalidate: 60 * 60 * 24 * 7,
    // Max once every 5 seconds, revalidate on the server to get a fresh version of this page
    maxAge: 5,
  });
};

// This function is called each time the route is loaded.
export const useServerTimeLoader = routeLoader$(async () => {
  // routeLoader$は、データ取得までページレンダリングを停止する
  // await new Promise((resolve) => setTimeout(resolve, 10000));
  // console.log(req);
  // return req.fail(404, { error: 'Not Found' });

  return {
    date: new Date().toISOString(),
  };
});

// Access the routeLoader$ data within another routeLoader$
export const useResolveServerTimeLoader = routeLoader$(async (req) => {
  const serverTime = await req.resolveValue(useServerTimeLoader);
  // 下層ルートで定義したもはエラーになる
  // const hoge = await req.resolveValue(usePostLoader);

  console.table(serverTime);
  // env for server side
  console.log(`From env file: ${req.env.get('APP_TITLE')}`);
});

export default component$(() => {
  useStyles$(styles);
  useResolveServerTimeLoader();

  return (
    <>
      <Header />
      <main>
        <Slot />
      </main>
      <Footer />
    </>
  );
});

export const head: DocumentHead = ({ head }) => ({
  title: `Qwik App | ${head.title}`,
});
