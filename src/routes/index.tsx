import {
  $,
  Resource,
  Signal,
  component$,
  createContextId,
  useComputed$,
  useContextProvider,
  useResource$,
  useSignal,
  useTask$,
} from '@builder.io/qwik';
import { server$, type DocumentHead, Link, useNavigate, useContent } from '@builder.io/qwik-city';
import { Collapsible } from '~/components/starter/collapsible';

import { Counter } from '~/components/starter/counter/counter';
import { Hero } from '~/components/starter/hero/hero';
import Infobox from '~/components/starter/infobox/infobox';
import { Starter } from '~/components/starter/next-steps/next-steps';
import { PassingCounter } from '~/components/starter/passing-counter/counter';
import { isBrowser, isServer } from '@builder.io/qwik/build';
import { ThemeDisply } from '~/components/starter/themeSwitcher';

export const ThemeContext = createContextId<Signal<string>>('docs.theme-context');

export default component$(() => {
  const nav = useNavigate();

  const content = useContent();
  console.log(content);

  const title = useSignal('Qwik');
  const description = useSignal('A resumable framework for building instant web applications');

  const prNumber = useSignal('3576');

  // passing state and function as props
  const count = useSignal(70);
  const setCount = $((newValue: number) => {
    if (newValue < 0 || newValue > 100) {
      return;
    }
    count.value = newValue;
  });
  const doubleCount = useComputed$(() => count.value * 2);

  const prTitle = useResource$<string>(async ({ track, cleanup }) => {
    // it will run first on mount (server), then re-run whenever prNumber changes (client)
    // this means this code will run on the server and the browser
    track(() => prNumber.value);

    const controller = new AbortController();
    cleanup(() => controller.abort()); // when prNumber changes, abort the previous fetch
    // return server$(async () => { // server side fetch
    const response = await fetch(`https://api.github.com/repos/BuilderIO/qwik/pulls/${prNumber.value}`);
    const data = await response.json();
    return data.title as string;
    // })();
  });

  if (!prTitle.loading) console.log(`loading`);

  // stateをtrackすることで、stateが変更されたときにブラウザ側で再度実行される
  useTask$(({ track }) => {
    track(() => title.value);
    console.log(`title is changed: ${title.value}`);
    // 明示的にserver$を使うことで、サーバー側でのみ実行される
    server$(() => console.log(`title is changed (this message shows only in server): ${title.value}`))();
  });

  // サーバー側で実行された場合、ブラウザ側で再度実行されることはない
  // 何もtrackしていないため、この関数は再度実行されることはない
  useTask$(async () => {
    // 下記の非同期処理が終わるまでブラウザ側でのレンダリングをブロックする
    // await new Promise((resolve) => setTimeout(resolve, 5000));
    console.log('This message shows only in server');
    console.log(`isServer ${isServer}`);
    console.log(`isBrowser ${isBrowser}`);
  });

  const theme = useSignal('dark');
  useContextProvider(ThemeContext, theme);

  return (
    <>
      {/* env for client side */}
      <h1>{import.meta.env.PUBLIC_APP_URL}</h1>

      <Hero />
      <Starter />

      <div role="presentation" class="ellipsis"></div>
      <div role="presentation" class="ellipsis ellipsis-purple"></div>

      <div class="container container-center container-spacing-xl">
        <h3>
          <ThemeDisply />
          <br /> (Context)
        </h3>
        <button onClick$={() => (theme.value = theme.value === 'dark' ? 'light' : 'dark')}>
          Switch Theme
        </button>
      </div>
      <div class="container container-center container-spacing-xl">
        <h3>Refreshing</h3>
        <Link reload>Link (reload)</Link>
        <button onClick$={() => nav()}>useNavigate</button>
      </div>

      <div class="container container-center container-spacing-xl">
        <h3>
          You can <span class="highlight">count</span>
          <br /> on me
        </h3>
        <Counter />
      </div>

      <div class="container container-center container-spacing-xl">
        <h3>
          You can <span class="highlight">count</span>
          <br /> on me (passing props and these props are reactive)
        </h3>
        <PassingCounter count={count} setCount={setCount} />
        <button onClick$={() => (count.value = 0)}>Reset</button>
        <p>{doubleCount}</p>
      </div>

      <div class="container container-center container-spacing-xl">
        <h3>You can input and it's reactive in child component</h3>
        <label>Title</label>
        <input bind:value={title} type="text" />
        <hr />
        <label>Description</label>
        <textarea bind:value={description} cols={50} />
        <hr />
        <Collapsible>
          <span q:slot="title">{title}</span>
          {description}
        </Collapsible>
      </div>

      <div class="container container-center container-spacing-xl">
        <h3>
          You can <span class="highlight">count</span>
          <br /> on me
        </h3>
        <input bind:value={prNumber} type="number" />
        <h4>PR#{prNumber}</h4>
        <Resource
          value={prTitle}
          onPending={() => <p>Loading...</p>}
          onRejected={(error) => <p>Error: {error.message}</p>}
          onResolved={(title) => <h4>{title}</h4>}
        />
      </div>

      <div class="container container-flex">
        <Infobox>
          <div q:slot="title" class="icon icon-cli">
            CLI Commands
          </div>
          <>
            <p>
              <code>npm run dev</code>
              <br />
              Starts the development server and watches for changes
            </p>
            <p>
              <code>npm run preview</code>
              <br />
              Creates production build and starts a server to preview it
            </p>
            <p>
              <code>npm run build</code>
              <br />
              Creates production build
            </p>
            <p>
              <code>npm run qwik add</code>
              <br />
              Runs the qwik CLI to add integrations
            </p>
          </>
        </Infobox>

        <div>
          <Infobox>
            <div q:slot="title" class="icon icon-apps">
              Example Apps
            </div>
            <p>
              Have a look at the <Link href="/demo/flower">Flower App</Link> or the{' '}
              <Link href="/demo/todolist">Todo App</Link>,
              <a
                href="/demo/todolist"
                preventdefault:click
                onClick$={(ev, currentTarget) => {
                  alert('prevent anchor link');
                  console.log(currentTarget);
                }}
              >
                {' '}
                Dummy Link
              </a>
              .
            </p>
          </Infobox>

          <Infobox>
            <div q:slot="title" class="icon icon-community">
              Community
            </div>
            <ul>
              <li>
                <span>Questions or just want to say hi? </span>
                <a href="https://qwik.builder.io/chat" target="_blank">
                  Chat on discord!
                </a>
              </li>
              <li>
                <span>Follow </span>
                <a href="https://twitter.com/QwikDev" target="_blank">
                  @QwikDev
                </a>
                <span> on Twitter</span>
              </li>
              <li>
                <span>Open issues and contribute on </span>
                <a href="https://github.com/BuilderIO/qwik" target="_blank">
                  GitHub
                </a>
              </li>
              <li>
                <span>Watch </span>
                <a href="https://qwik.builder.io/media/" target="_blank">
                  Presentations, Podcasts, Videos, etc.
                </a>
              </li>
            </ul>
          </Infobox>
        </div>
      </div>
    </>
  );
});

export const head: DocumentHead = {
  title: 'Welcome to Qwik',
  meta: [
    {
      name: 'description',
      content: 'Qwik site description',
    },
  ],
};
