import type { Signal, PropFunction } from '@builder.io/qwik';
import { component$ } from '@builder.io/qwik';
import styles from './counter.module.css';
import Gauge from '../gauge';

interface Props {
  count: Signal<number>;
  setCount: PropFunction<(newValue: number) => void>;
}

// 親で定義したstateを子に渡し、子から親のstateを更新する
export const PassingCounter = component$<Props>(({ count, setCount }) => {
  return (
    <>
      <div class={styles['counter-wrapper']}>
        <button class="button-dark button-small" onClick$={() => setCount(count.value - 1)}>
          -
        </button>
        <Gauge value={count.value} />
        <button class="button-dark button-small" onClick$={() => setCount(count.value + 1)}>
          +
        </button>
      </div>
    </>
  );
});
