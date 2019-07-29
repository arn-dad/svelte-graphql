import Login from "../pages/login.svelte"; 
import Booking from "../pages/booking.svelte";
import Events from "../pages/events.svelte";

export default [
    {
        id: 'login',
        label: 'Login',
        path: '/',
        status: 'open',
        component: Login
    },
    {
        id: 'events',
        label: 'Events',
        path: '/events',
        status: 'always',
        component: Events
    },
    {
        id: 'booking',
        label: 'Bookings',
        path: '/booking',
        status: 'private',
        component: Booking
    },
    {
        id: 'logout',
        label: 'Logout',
        path: '/',
        status: 'private',
        component: Login
    },
]