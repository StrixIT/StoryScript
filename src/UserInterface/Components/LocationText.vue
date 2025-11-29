<template>
  <div v-if="show" class="box-container" id="location">
    <div class="box-title" v-html="texts.format(texts.youAreHere, [location.name])"></div>
    <div textFeatures>
      <div v-html="location.description"></div>
    </div>
    <ul id="location-log" class="list-unstyled">
      <li v-for="message in location.log" v-html="message"></li>
    </ul>
  </div>
</template>
<script lang="ts" setup>
  import {computed} from "vue";
  import {useStateStore} from "vue/StateStore.ts";
  import {storeToRefs} from "pinia";
  import {ICompiledLocation} from "storyScript/Interfaces/compiledLocation.ts";

  const store = useStateStore();
  const {texts} = storeToRefs(store);

  const { location } = defineProps<{
    location?: ICompiledLocation
  }>();
  
  const show = computed(() => location.description || !location.features?.collectionPicture);
</script>