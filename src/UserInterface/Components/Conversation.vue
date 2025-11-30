<template>
  <dialog :open="playState === PlayState.Conversation" class="dialog">
    <h1 v-if="person" class="dialog-title conversation-title">
      {{ (person.conversation.title || texts.format(texts.talk, [person.name])) }}
    </h1>
    <div class="dialog-body conversation-body">
      <div v-if="person.conversation" id="conversation">

        <div v-if="person.conversation.activeNode" id="conversation-options">
          <div v-html="getLines(person.conversation.activeNode)"></div>
          <div v-for="reply of person.conversation.activeNode.replies">
          <div v-if="reply.available || reply.showWhenUnavailable" :class="{ 'unavailable': !reply.available }">
            <input type="radio" :disabled="!reply.available" @click="answer(person.conversation.activeNode, reply)" />
            <span v-html="getLines(reply)"></span>
          </div>
          </div>
        </div>
        
        <div v-if="!person.conversation.activeNode || !person.conversation.activeNode.replies.length">
          {{ texts.conversationEnded }}
        </div>

        <div id="conversation-history">
          <hr />
          <p id="conversation-history-title">Conversation history</p>
          <ul class="list-unstyled">
            <li v-for="entry of person.conversation.conversationLog">
              <div class="conversation-lines" v-html="entry.lines"></div>
              <div class="conversation-option" v-html="entry.reply"></div>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </dialog>
</template>
<script lang="ts" setup>
import {useStateStore} from "vue/StateStore.ts";
import {storeToRefs} from "pinia";
import {PlayState} from "storyScript/Interfaces/enumerations/playState.ts";
import {IConversationNode} from "storyScript/Interfaces/conversations/conversationNode.ts";
import {IConversationReply} from "storyScript/Interfaces/conversations/conversationReply.ts";
import {useServices} from "vue/Services.ts";
import {IConversation} from "storyScript/Interfaces/conversations/conversation.ts";
import {IPerson} from "storyScript/Interfaces/person.ts";

const store = useStateStore();
const {texts} = storeToRefs(store);
const conversationService = useServices().getConversationService();

const { playState, person } = defineProps<{
  person?: IPerson,
  playState?: PlayState
}>();

const answer = (node: IConversationNode, reply: IConversationReply): void => conversationService.answer(node, reply);

const getLines = (nodeOrReply: IConversationNode | IConversationReply): string => nodeOrReply?.lines || null;

</script>