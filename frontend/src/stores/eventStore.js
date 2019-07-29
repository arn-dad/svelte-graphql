import { writable } from 'svelte/store';

const initialEventsStore = {
   events: []
}

const eventStore = writable(initialEventsStore);

export default eventStore;