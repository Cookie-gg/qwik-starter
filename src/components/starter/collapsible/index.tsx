import { component$, useSignal, Slot } from '@builder.io/qwik';

export const Collapsible = component$(() => {
  const isOpen = useSignal(true);

  return (
    <div>
      <h1 onClick$={() => (isOpen.value = !isOpen.value)}>
        {isOpen.value ? '▼' : '▶︎'}
        <Slot name="title" />
      </h1>
      {isOpen.value && <Slot />}
    </div>
  );
});
