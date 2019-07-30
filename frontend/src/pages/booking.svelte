<script>
  import { onMount } from 'svelte'
  import Spinner from '../components/spinner/Spinner.svelte'
  import BookingList from '../components/BookingList/BookingList.svelte'
  import { bookingQuery, bookingCancelMutation } from '../queryCreators'
  import { userStore, bookingStore } from '../stores'

  let userData = null;
  let bookings = [];
  let isLoading = false;
  let tabsState = true;

  userStore.subscribe(usStore => {
    userData = usStore
  })

  bookingStore.subscribe(boStore => {
    bookings = boStore.bookings
  })

  onMount(() => {
    fetchBookings()
  })

  async function fetchBookings() {
    const { token } = userData
    isLoading = true
    try {
      const response = await fetch('http://localhost:3000/graphql', {
        method: 'POST',
        body: JSON.stringify(bookingQuery()),
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + token,
        },
      })

      if (response.status === 200 && response.ok) {
        //....

        const {
          data: { bookings },
        } = await response.json()
        console.log('TCL: fetchBookings -> bookings', bookings)

        bookingStore.update(bookingStore => ({
          ...bookingStore,
          bookings: bookings,
        }))
        isLoading = false
      }
    } catch (error) {
      console.log('TCL: fetchBookings -> error', error)
      isLoading = false
    }
  }
  async function handleCancelBooking(bookingId) {
       const { token } = userData
  console.log("TCL: handleCancelBooking -> bookingId", bookingId)
 try {
      const response = await fetch('http://localhost:3000/graphql', {
        method: 'POST',
        body: JSON.stringify(bookingCancelMutation({bookingId})),
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + token,
        },
      })

      if (response.status === 200 && response.ok) {
        //....

        const {data: { cancelBooking: { _id: eventId } }} = await response.json();
        console.log("TCL: handleCancelBooking -> eventId", eventId)
        const newBookingList = bookings.filter(bookedEvent => bookedEvent.event._id !== eventId)
        console.log("TCL: handleCancelBooking -> newBookingList", newBookingList)
        bookingStore.update(bookingStore => ({
          ...bookingStore,
          bookings: newBookingList
        }))
      }
    } catch (error) {
      console.log('TCL: fetchBookings -> error', error)
    }
  }
  function changeTabsContnet(view) {
    tabsState = view
  }
</script>

<style>
  .tabs {
    
  }
  .tabs-controls {
    width: 120px;
    margin: 0 auto;
  }

  .link-active {
    border-bottom: 1px solid rgb(99, 99, 99);
  }

  .chart-box {
    margin: 0 auto;
    margin-top: 2rem;
    width: 40rem;
    max-width: 90%;
    list-style: none;
    padding: 0;
  }

</style>

<div class="page-content">
  <div class="tabs">
    <div class="tabs-controls">
      <button class={`btn ${tabsState ? 'link-active' : ''}`} on:click="{() => changeTabsContnet(true)}">List</button>
      <button class={`btn ${!tabsState ? 'link-active' : ''}`} on:click="{() => changeTabsContnet(false)}">Chart</button>
    </div>

    {#if tabsState}
      {#if isLoading}
        <Spinner />
      {:else}
        <BookingList {bookings} handleCancelBooking={handleCancelBooking} />
      {/if}
      {:else}
        <div class="chart-box">
          Chart
        </div>
    {/if}
  </div>
</div>



