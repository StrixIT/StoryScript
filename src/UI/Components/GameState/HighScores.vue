<template>
  <div id="highscores">
    <h3>{{ texts.highScores }}</h3>
    <table>
      <tr v-for="score of scores">
        <td>{{ score.name }}</td>
        <td>{{ score.score }}</td>
      </tr>
    </table>
  </div>
</template>
<script lang="ts" setup>
import {useStateStore} from "ui/StateStore.ts";

const store = useStateStore();
const {texts} = store.services;

const {scores} = defineProps<{
  scores: { name: string, score: number }[];
}>();

</script>