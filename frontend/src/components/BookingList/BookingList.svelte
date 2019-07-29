<script>
  import { createEventDispatcher } from 'svelte'

  export let bookings = [], handleCancelBooking;
  console.log('TCL: bookings', bookings)
  const dispatch = createEventDispatcher()
</script>

<style>
  .booking-list {
    margin: 0 auto;
    margin-top: 2rem;
    width: 40rem;
    max-width: 90%;
    list-style: none;
    padding: 0;
  }
  .booking-list_item {
       box-shadow: 0 4px 8px 0 rgba(0,0,0,0.2);
       transition: 0.3s;
       border-radius: 5px;
       display: flex;
       justify-content: space-between;
       margin: 1rem 0;
       padding: 1rem;
       border: 1px solid aquamarine;
  }
  .booking-list_item:hover {
  box-shadow: 0 8px 16px 0 rgba(0,0,0,0.2);
}
.booking-list_text {
    font-size: 1.125em;
    color: #777;
}
</style>

<ul class="booking-list">
  {#each bookings as book (book._id)}
    <li class="booking-list_item">
      <div class="booking-list_text">
        {book.event.title} - {new Date(book.event.date).toLocaleDateString('de-De')}
      </div>
      <button class="pure-button" on:click="{() => handleCancelBooking(book._id)}">Cancel</button>
    </li>
  {/each}
</ul>
