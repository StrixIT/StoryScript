<template>
  <div class="collapsible-header" :class="headerClass" @click="toggleCollapsible" ref="collapsible-header">
    <slot name="header">
      {{ text }}
    </slot>
  </div>
  <div class="collapsible-body">
    <slot></slot>
  </div>
</template>
<script lang="ts" setup>

import {computed, onMounted, ref, useTemplateRef} from "vue";

const { preventCollapse, headerClass } = defineProps<{
  text?: string;
  headerClass?: string;
  preventCollapse?: (isCollapsed: boolean) => boolean;
}>();

const isCollapsed = ref(false);
const collapsibleHeader = useTemplateRef('collapsible-header');
const collapsibleContent = computed(() => collapsibleHeader.value?.nextElementSibling as HTMLElement);

const setHeight = () => {
  collapsibleContent.value.style.maxHeight = isCollapsed.value ? '0px' : null;
}

onMounted(() => {
  collapsibleContent.value.classList.add('collapsible');
  setHeight();
});

const toggleCollapsible = () => {
  if (preventCollapse?.(isCollapsed.value)) {
    return;
  }

  isCollapsed.value = !isCollapsed.value;

  if (isCollapsed.value) {
    collapsibleHeader.value.classList.add('collapsed');
  } else {
    collapsibleHeader.value.classList.remove('collapsed');
  }

  setHeight();
}

</script>