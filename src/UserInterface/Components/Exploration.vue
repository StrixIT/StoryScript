<template>
  <div id="exploration">
<!--    @if (actionsPresent())-->
<!--    {-->
<!--    <div class="box-container" id="exploration-actions">-->
<!--      <div class="box-title">{{ texts.actions }}</div>-->
<!--      @if (!confirmAction)-->
<!--      {-->
<!--      <ul class="list-unstyled">-->
<!--        @for (action of game.currentLocation.activeActions; track action)-->
<!--        {-->
<!--        @if (!hideActionButton(action))-->
<!--        {-->
<!--        <li class="inline">-->
<!--          <button type="button" class="btn" [ngClass]="getButtonClass(action)" (click)="executeAction(action)" [disabled]="disableActionButton(action)">{{ action[1].text }}</button>-->
<!--        </li>-->
<!--        }-->
<!--        }-->
<!--      </ul>-->
<!--      }-->
<!--      @if (confirmAction)-->
<!--      {-->
<!--      <div>-->
<!--        <p [innerHTML]="confirmAction[1].confirmationText | safe: 'html'"></p>-->
<!--        <ul class="list-unstyled">-->
<!--          <li class="inline">-->
<!--            <button type="button" class="btn btn-primary" (click)="cancelAction()">{{ texts.cancelAction }}</button>-->
<!--            <button type="button" class="btn btn-warning" (click)="executeAction(confirmAction)">{{ texts.confirmAction }}</button>-->
<!--          </li>-->
<!--        </ul>-->
<!--      </div>-->
<!--      }-->
<!--    </div>-->
<!--    }-->
<!--    @if (!enemiesPresent())-->
<!--    {-->
    <div class="box-container" id="exploration-destinations">
      <div class="box-title">{{ texts.destinations }}</div>
      <ul class="list-unstyled">
        <li v-for="destination of game.currentLocation.activeDestinations" :class="`inline ${destination.visited ? '' : 'not-'}visited`">
<!--          @for (barrier of destination.barriers; track barrier)-->
<!--          {-->
<!--          <div class="barrier">-->
<!--            @let barrierEntry = barrier[1];-->
<!--            @if (!barrierEntry.actions?.length)-->
<!--            {-->
<!--            <button class="btn btn-outline-primary">{{ barrierEntry.name }}</button>-->
<!--            }-->
<!--            @if (barrierEntry.actions?.length)-->
<!--            {-->
<!--            <div ngbDropdown class="d-inline-block" class="action-select">-->
<!--              <button class="btn btn-outline-primary" id="barrierdropdown" ngbDropdownToggle>{{ barrierEntry.name }}</button>-->
<!--              <div ngbDropdownMenu aria-labelledby="barrierdropdown">-->
<!--                @for (action of barrier[1].actions; track action)-->
<!--                {-->
<!--                <button ngbDropdownItem (click)="executeBarrierAction(barrier, action, destination)">{{ action[1].text }}</button>-->
<!--                }-->
<!--              </div>-->
<!--            </div>-->
<!--            }-->
<!--          </div>-->
<!--          }-->
          <button type="button" class="btn btn-info" :class="destination.style" @click="changeLocation(<string>destination.target)" :disabled="!destination.target || destination.barriers?.length > 0">
<!--            @if (isPreviousLocation(destination))-->
<!--            {-->
<!--            <span class="back-label">{{ texts.back }}</span>-->
<!--            }-->
            {{ destination.name }}
          </button>
        </li>
      </ul>
    </div>
<!--    }-->
  </div>
</template>
<script lang="ts" setup>
import {useStateStore} from "vue/StateStore.ts";
import {storeToRefs} from "pinia";

const store = useStateStore();
const {game, texts} = storeToRefs(store);

const changeLocation = (location: string) => store.update(() => game.value.changeLocation(location, true));

</script>