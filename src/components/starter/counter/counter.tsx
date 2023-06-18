import { component$, useSignal, $ } from '@builder.io/qwik';
import styles from './counter.module.css';
import Gauge from '../gauge';
import { css } from '~/libs/stiches';

const counterWrapper = css({
  marginTop: '50px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: '10px',
});

export const Counter = component$(() => {
  const count = useSignal(70);
  const state = useSignal({ count: 70 });

  const setCount = $((newValue: number) => {
    if (newValue < 0 || newValue > 100) {
      return;
    }
    state.value.count = newValue; //! This expression is not working
    // state.value = { count: newValue }; //* This expression is working
    count.value = newValue;
  });

  return (
    <>
      <div class={counterWrapper().toString()}>
        <button class="button-dark button-small" onClick$={[print, $(() => setCount(count.value - 1))]}>
          - (Multiple Events)
        </button>
        <Gauge value={count.value} />
        <button class="button-dark button-small" onClick$={() => setCount(count.value + 1)}>
          +
        </button>
      </div>
      <div class={styles['counter-wrapper']}>
        <button class="button-dark button-small" onClick$={() => setCount(state.value.count - 1)}>
          -
        </button>
        <Gauge value={state.value.count} />
        <button class="button-dark button-small" onClick$={() => setCount(state.value.count + 1)}>
          +
        </button>
      </div>
    </>
  );
});
