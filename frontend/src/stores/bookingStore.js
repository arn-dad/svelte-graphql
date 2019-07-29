import { writable } from 'svelte/store';

const initialBookingStore = {
    bookings: []
}

const bookingStore = writable(initialBookingStore);

export default bookingStore;