<script>
  import { onMount } from 'svelte'
  import Modal from '../components/Modal.svelte'
  import EventList from '../components/EventList/EventList.svelte'
  import Spinner from '../components/spinner/Spinner.svelte'
  import { singleEvent } from '../constants'
  import {
    createEventMutation,
    getEvnetsQuery,
    bookingMutation,
  } from '../queryCreators'
  import { userStore, eventStore } from '../stores'

  onMount(() => {
    fetchEvents()
  })

  let showModal = false
  let showViewEventModal = false
  let events = []
  let newEvent = { ...singleEvent }
  let userData = null
  let isLoading = false
  let selectedEvent = null

  userStore.subscribe(usStore => {
    userData = usStore
  })

  eventStore.subscribe(evStore => {
    events = evStore.events
    console.log('TCL: events', events)
  })

  async function fetchEvents() {
    isLoading = true
    try {
      const response = await fetch('http://localhost:3000/graphql', {
        method: 'POST',
        body: JSON.stringify(getEvnetsQuery()),
        headers: {
          'Content-Type': 'application/json',
        },
      })
      if (response.status === 200 && response.ok) {
        const eventsData = await response.json()
        console.log('TCL: fetchEvents -> responseData', eventsData)
        eventStore.update(eventStore => ({
          ...eventStore,
          events: eventsData.data.events,
        }))
        isLoading = false
      }
      console.log('TCL: fetchEvents -> response', response)
    } catch (error) {
      console.log('TCL: fetchEvents -> error', error)
      isLoading = false
    }
  }
  function handleNewEventSubmit() {
    console.log('TCL: newEvent', newEvent)

    if (!userData && !userData.token) {
      console.log('Unauthorized!')
      return
    }

    const { token } = userData

    // validation needed!
    const preperedQueryEvent = createEventMutation({
      ...newEvent,
      price: +newEvent.price,
    })

    fetch('http://localhost:3000/graphql', {
      method: 'POST',
      body: JSON.stringify(preperedQueryEvent),
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + token,
      },
    })
      .then(res => {
        if (res.status !== 200 && res.status !== 201) {
          throw new Error('Failed!')
        }
        return res.json()
        console.log('TCL: res', res)
      })
      .then(resData => {
        console.log('TCL: handleNewEventSubmit -> resData', resData)
        const {
          data: { createEvent },
        } = resData
        eventStore.update(eventStore => ({
          ...eventStore,
          events: [...eventStore.events, createEvent],
        }))
      })
      .catch(err => {
        console.log('TCL: err', err)
      })

    showModal = false // closed the modal
  }

  function handelViewEvent(event) {
    console.log('TCL: handelViewEvent -> eventId', event)
    const { detail: eventId } = event
    const findSelectedEvent =
      events.find(event => event._id === eventId) || null
    if (!findSelectedEvent) {
      return
    }

    selectedEvent = findSelectedEvent
    showViewEventModal = true
    console.log('TCL: handelViewEvent -> selectedEvent', selectedEvent)
  }

  async function handleNewBooking(eventId) {
    const { token } = userData
    try {
      const response = await fetch('http://localhost:3000/graphql', {
        method: 'POST',
        body: JSON.stringify(bookingMutation({ eventId })),
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + token,
        },
      })
      if (response.status === 200 && response.ok) {
        const bookingResponse = await response.json()
        console.log('TCL: handleNewBooking -> bookingResponse', bookingResponse)
        //...
      }
      console.log('TCL: fetchEvents -> response', response)
    } catch (error) {
      console.log('TCL: fetchEvents -> error', error)
    }
  }
</script>

<style>
  .event-create {
    width: 25%;
    padding: 15px;
    min-width: 350px;
    margin: 0 auto;
    display: flex;
    justify-content: center;
    align-content: center;
    border: 1px solid #000;
    border-radius: 5px;
  }
  .event-create_box {
    display: flex;
    flex-direction: column;
  }
</style>

{#if userData && userData.token}
  <div class="event-create">
    <div class="event-create_box">
      <h6>Share your own event!</h6>
      <button
        class="button-warning pure-button"
        on:click={() => (showModal = !showModal)}>
        Create Event
      </button>
    </div>
  </div>
{/if}

{#if isLoading}
  <Spinner />
{:else}
  <EventList {events} on:viewEventDetails={event => handelViewEvent(event)} />
{/if}
<Modal
  open={showModal}
  on:close={() => (showModal = false)}
  on:confirm={handleNewEventSubmit}>
  <h1 slot="header">Create new Event</h1>

  <form
    class="pure-form pure-form-stacked"
    on:submit|preventDefault={handleNewEventSubmit}>
    <div class="form-control">
      <label for="title">Title</label>
      <input bind:value={newEvent.title} type="text" id="title" name="title" />
    </div>
    <div class="form-control">
      <label for="price">Price</label>
      <input bind:value={newEvent.price} type="text" id="price" name="price" />
    </div>
    <div class="form-control">
      <label for="title">Date</label>
      <input
        bind:value={newEvent.date}
        type="datetime-local"
        id="title"
        name="date" />
    </div>
    <div class="form-control">
      <label for="description">Description</label>
      <textarea
        bind:value={newEvent.description}
        rows="4"
        id="description"
        name="description" />
    </div>
  </form>
</Modal>

<Modal
  open={showViewEventModal}
  on:close={() => (showViewEventModal = false)}
  on:book={handleNewBooking}>
  <h1 slot="header">{selectedEvent.title}</h1>
  <div class="booking-content">
    <div>{selectedEvent.title}</div>
    <div>
      {selectedEvent.price} - {new Date(selectedEvent.date).toLocaleDateString('de-De')}
    </div>
    <div>{selectedEvent.description}</div>
  </div>
  <div slot="footer">
    <button class="pure-button" on:click={() => (showViewEventModal = false)}>
      Close
    </button>
    <button
      class="button-success pure-button"
      on:click={() => handleNewBooking(selectedEvent._id)}>
      Book
    </button>
  </div>
</Modal>
