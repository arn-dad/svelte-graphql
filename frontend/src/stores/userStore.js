import { writable } from 'svelte/store';

const initialUserStore = {
    userId: null,
    token: null,
    tokenExpiration: null
}

const userStore = writable(initialUserStore);

export default userStore;