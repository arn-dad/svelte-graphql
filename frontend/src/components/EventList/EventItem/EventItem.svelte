<script>
  import { userStore } from '../../../stores'
  export let data, onViewDetails

  const { title, price, creator, date, _id } = data
  console.log('TCL: data', data)
  let userData = {}

  userStore.subscribe(usStore => {
    userData = usStore
  })
  const { userId, token } = userData
  function viewEventDetails(eventId) {
    onViewDetails(eventId)
    console.log('TCL: viewEventDetails -> eventId', eventId)
  }
</script>

<style>
  .event-list_item {
    display: flex;
    justify-content: space-between;
    margin: 1rem 0;
    padding: 1rem;
    border: 1px solid aquamarine;
  }
  .event-list_item h1 {
    font-size: 1.5rem;
    color: aquamarine;
  }

  .event-list_item h2 {
    font-size: 1rem;
    color: #ccc;
  }
  .event-list_item p {
    margin: 0;
  }
</style>

<li class="event-list_item">
  <div>
    <h1>{title}</h1>
    <h2>${price} - {new Date(date).toLocaleDateString('de-De')}</h2>
  </div>
  <div>
    {#if userId && userId === creator._id}
      <p>Your the owner of this event</p>
    {:else if token}
      <button
        on:click={viewEventDetails.bind(this, _id)}
        class="button-secondary pure-button">
        View Details
      </button>
    {/if}
  </div>
</li>
