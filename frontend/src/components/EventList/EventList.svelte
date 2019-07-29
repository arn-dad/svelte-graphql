<script>
  import { createEventDispatcher } from 'svelte'
  import EventItem from './EventItem/EventItem.svelte'

  export let events = []
  const dispatch = createEventDispatcher()
</script>

<style>
  .event-list {
    margin: 0 auto;
    margin-top: 2rem;
    width: 40rem;
    max-width: 90%;
    list-style: none;
    padding: 0;
  }
</style>

<ul class="event-list">
  {#each events as event (event._id)}
    <EventItem
      data={event}
      onViewDetails={eventId => dispatch('viewEventDetails', eventId)} />
  {/each}
</ul>
