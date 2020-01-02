<template>
  <div class="m-draggable" :id="id">
    <slot />
  </div>
</template>

<script>
import { Sortable, Swap } from "sortablejs/modular/sortable.core.esm";
import { uuId } from '@/utils/helper'

Sortable.mount(new Swap());

const defaultOptions = {
  swap: true,
  swapClass: "swap-target",
  filter: '.undraggable',
  animation: 300
};

export default {
  props: {
    options: {
      type: Object,
      default: () => defaultOptions
    }
  },

  watch: {
    options: {
      deep: true,
      handler(val) {
        this.instance && this.instance.option(val);
      }
    }
  },

  data() {
    return {
      id: uuId(),
      instance: null
    };
  },

  mounted() {
    this.instance = new Sortable(
      document.getElementById(this.id),
      Object.assign({}, defaultOptions, this.options)
    );
  },

  beforeDestroy() {
    this.instance && this.instance.destroy();
  }
};
</script>
