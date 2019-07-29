<script>
  import { createEventDispatcher } from 'svelte'
  export let open

  const dispatch = createEventDispatcher()
</script>

<style>
  .backdrop {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100vh;
    background: rgba(0, 0, 0, 0.75);
    z-index: 10;
  }

  .modal {
    padding: 1rem;
    position: fixed;
    top: 10vh;
    left: 30%;
    width: 40%;
    max-height: 80vh;
    min-width: 300px;
    min-height: 280px;
    margin: 0 auto;
    background: white;
    border-radius: 5px;
    z-index: 100;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.26);
  }

  .modal-content {
    padding: 10px 0;
  }

  header {
    border-bottom: 1px solid #ccc;
  }
</style>

{#if open}
  <div class="backdrop" on:click={() => dispatch('close')} />
  <div class="modal">
    <header>
      <slot name="header" />
    </header>
    <div class="modal-content">
      <slot />
    </div>

    <footer>
      <slot name="footer">
        <button on:click={() => dispatch('close')}>Close</button>
        <button on:click={() => dispatch('confirm')}>Confirm</button>
      </slot>
    </footer>
  </div>
{/if}
