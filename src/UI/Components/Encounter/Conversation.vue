<template>
  <modal-dialog :canClose="true"
                :closeButton="true"
                :openState="PlayState.Conversation"
                :title="game.person.conversation.title || texts.format(texts.talk, [game.person.name])">
    <div id="conversation">
      <img v-if="game.person.picture" :alt="game.person.name" :src="game.person.picture"/>
      <div v-if="game.person.conversation.activeNode" id="conversation-options">
        <div v-html="getLines(game.person.conversation.activeNode)"></div>
        <ul>
          <li v-for="reply of game.person.conversation.activeNode.replies.filter(r => r.available || r.showWhenUnavailable)">
            <div :class="{ 'unavailable': !reply.available }" @click="answer(reply)">
              <span v-html="getLines(reply)"></span>
            </div>
          </li>
        </ul>
      </div>

      <div v-if="!game.person.conversation.activeNode?.replies?.length">
        {{ texts.conversationEnded }}
      </div>

      <div id="conversation-history">
        <hr/>
        <p id="conversation-history-title">Conversation history</p>
        <ul class="list-unstyled">
          <li v-for="entry of game.person.conversation.conversationLog">
            <div class="conversation-lines" v-html="entry.lines"></div>
            <div class="conversation-option" v-html="entry.reply"></div>
          </li>
        </ul>
      </div>
    </div>
  </modal-dialog>
</template>
<script lang="ts" setup>
import {useStateStore} from "ui/StateStore.ts";
import {PlayState} from "storyScript/Interfaces/enumerations/playState.ts";
import {IConversationNode} from "storyScript/Interfaces/conversations/conversationNode.ts";
import {IConversationReply} from "storyScript/Interfaces/conversations/conversationReply.ts";
import {storeToRefs} from "pinia";

const store = useStateStore();
const {game} = storeToRefs(store);
const {texts, conversationService} = store.services;

const getLines = (nodeOrReply: IConversationNode | IConversationReply): string => nodeOrReply?.lines || null;

const answer = (reply: IConversationReply) => {
  if (reply.available) {
    conversationService.answer(game.value.person.conversation.activeNode, reply)
  }
}

</script>