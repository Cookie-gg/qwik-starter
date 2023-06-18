import { Slot, component$ } from '@builder.io/qwik';
import { routeLoader$ } from '@builder.io/qwik-city';

export const usePostLoader = routeLoader$(async () => {
  return {
    message: 'from layout (/post/[id])'
  };
});

export default component$(() => {
  return (
    <>
      <Slot />
    </>
  );
});
