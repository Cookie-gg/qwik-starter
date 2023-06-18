import { component$ } from '@builder.io/qwik';
import type { DocumentHead} from '@builder.io/qwik-city';
import { useLocation } from '@builder.io/qwik-city';
import { useServerTimeLoader } from '~/routes/layout';

export default component$(() => {
  const loc = useLocation();
  return <h1>This is {loc.params.id}</h1>;
});

export const head: DocumentHead = (req) => {
  const time = req.resolveValue(useServerTimeLoader);
  return {
    title: `Post ${req.params.id} ${time.date}`,
  };
};
