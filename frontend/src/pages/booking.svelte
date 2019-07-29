<script>
  import { onMount } from 'svelte'
  import Spinner from '../components/spinner/Spinner.svelte'
  import BookingList from '../components/BookingList/BookingList.svelte'
  import { bookingQuery, bookingCancelMutation } from '../queryCreators'
  import { userStore, bookingStore } from '../stores'

  let userData = null
  let bookings = []
  let isLoading = false

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
</script>

{#if isLoading}
  <Spinner />
{:else}
  <BookingList {bookings} handleCancelBooking={handleCancelBooking} />
{/if}
