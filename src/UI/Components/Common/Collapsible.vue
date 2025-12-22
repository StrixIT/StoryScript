<template>
  <div :class="headerClass" @click="toggleCollapsible" ref="collapsible-header">
    <slot name="header">
      {{ text }}
    </slot>
  </div>
  <slot></slot>
</template>
<script lang="ts" setup>

import {computed, onMounted, ref, useTemplateRef} from "vue";

const { headerClass } = defineProps<{
  text?: string;
  headerClass?: string
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
  isCollapsed.value = !isCollapsed.value;
  setHeight();
}

</script>