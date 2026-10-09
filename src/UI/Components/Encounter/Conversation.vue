<template>
  <modal-dialog :canClose="true"
                :closeButton="true"
                :openState="PlayState.Conversation"
                :title="game.person.conversation.title || texts.format(texts.talk, [game.person.name])">
    <div id="conversation">
      <img v-if="game.person.picture" :alt="game.person.name" :src="game.person.picture"/>
      <div v-if="game.person.conversation.activeNode" id="conversation-options">
        <div v-html="textToShow"></div>
        <ul>
          <li v-for="reply of repliesToShow">
            <div :class="{ 'unavailable': !reply.available }" @click="answer(reply)">
              <span v-html="reply.lines"></span>
            </div>
          </li>
        </ul>
      </div>

      <div v-if="!game.person.conversation.activeNode?.replies?.length">
        {{ texts.conversationEnded }}
      </div>

      <div v-if="game.person.conversation.conversationLog?.length" id="conversation-history">
        <p id="conversation-history-title">Conversation history</p>
        <ul class="list-unstyled">
          <li v-for="entry of game.person.conversation.conversationLog">
            <div class="conversation-lines" v-html="stripAutoplay(entry.lines)"></div>
            <div class="conversation-option" v-html="stripAutoplay(entry.reply)"></div>
          </li>
        </ul>
      </div>
    </div>
  </modal-dialog>
</template>
<script lang="ts" setup>
import {useStateStore} from "ui/StateStore.ts";
import {PlayState} from "storyScript/Interfaces/enumerations/playState.ts";
import {IConversationReply} from "storyScript/Interfaces/conversations/conversationReply.ts";
import {checkAutoplay} from "ui/helpers.ts";
import {storeToRefs} from "pinia";
import {ref, watch} from "vue";

const store = useStateStore();
const {game} = storeToRefs(store);
const {texts, conversationService} = store.services;

const textToShow = ref<string>(null);
const repliesToShow = ref<IConversationReply[]>(null);

watch(() => game.value.person.conversation.activeNode, async (newValue) => {
  textToShow.value = checkAutoplay(game.value, newValue?.lines);
  repliesToShow.value = newValue?.replies.filter(r => r.available || r.showWhenUnavailable).map(r => {
    if (r.lines) {
      r.lines = checkAutoplay(game.value, r.lines);
    }

    return r;
  });
}, { immediate: true });

const answer = (reply: IConversationReply) => {
  if (reply.available) {
    conversationService.answer(game.value.person.conversation.activeNode, reply)
  }
}

const stripAutoplay = (value: string) => value.replace('autoplay="autoplay"', '');

</script>