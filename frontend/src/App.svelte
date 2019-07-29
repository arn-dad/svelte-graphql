<script>
  import { Router, Link, Route } from 'svelte-routing'
  import routes from './routes'
  import { userStore } from './stores'

  export let url = ''

  let userData = {
    token: null,
    userId: null,
  }

  userStore.subscribe(usStore => {
    console.log('TCL: usStore', usStore)
    userData = usStore
  })
</script>

<style>
  .logo {
    color: rgb(75, 75, 75);
    font-weight: 500;
  }
  .header {
    height: 45px;
    align-items: center;
    background: aquamarine;
    display: flex;
    justify-content: space-between;
    padding: 0 15px;
  }
  .nav {
    display: flex;
    align-items: center;
  }
  .nav-item,
  .nav-item a {
    font-weight: 100;
    color: #666;
    padding: 5px;
    position: relative;
  }
  .nav-item:after {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    margin: auto;
    width: 0%;
    content: '.';
    color: transparent;
    background: #aaa;
    height: 1px;
  }
  .nav-item:hover:after {
    width: 100%;
  }
</style>

<Router {url}>
  <header class="header">
    <div class="logo">EasyEvent</div>
    <nav class="nav stroke">
      {#each routes as route}
        {#if route.status === 'private' && userData.token}
          <span class="nav-item">
            <Link to={route.path}>{route.label}</Link>
          </span>
        {:else if route.status === 'always'}
          <span class="nav-item">
            <Link to={route.path}>{route.label}</Link>
          </span>
        {:else if route.status === 'open' && !userData.token}
          <span class="nav-item">
            <Link to={route.path}>{route.label}</Link>
          </span>
        {/if}
      {/each}
    </nav>
  </header>

  <div>
    {#each routes as route}
      <Route path={route.path} component={route.component} />
    {/each}
  </div>
</Router>
