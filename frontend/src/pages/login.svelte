<script>
  import { navigate } from 'svelte-routing'
  import { loginMutation, signupQuery } from '../queryCreators'
  import { userStore } from '../stores'

  console.log('TCL: userStore', userStore)
  let formData = {
    email: '',
    password: '',
  }
  let isLogin = false
  let userData

  userStore.subscribe(usStore => {
    console.log('TCL: usStore', usStore)
    userData = usStore
  })

  function handleInputChange({ target: { name, value } }) {
    formData[name] = value
  }

  function handleSubmit(event) {
    const { email, password } = formData
    if (email.trim().length === 0 || password.trim().length === 0) {
      return
    }

    const query = isLogin ? loginMutation(formData) : signupQuery(formData)

    fetch('http://localhost:3000/graphql', {
      method: 'POST',
      body: JSON.stringify(query),
      headers: {
        'Content-Type': 'application/json',
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
        const {
          data: { login = null },
        } = resData
        if (login) {
          userStore.update(userStore => ({
            ...userStore,
            ...login,
          }))
          navigate('/events', { replace: true })
        }
      })
      .catch(err => {
        console.log('TCL: err', err)
      })
    console.log('TCL: handleSubmit -> event', event)
    console.log('TCL: handleSubmit -> formData', formData)
    formData = {
      email: '',
      password: '',
    }
  }

  function handleSignup(event) {
    console.log('TCL: handleSignup -> event', event)
  }

  function handleFormActionChange() {
    isLogin = !isLogin
  }
</script>

<style>
  .auth-form {
    width: 40rem;
    max-width: 80%;
    margin: 5rem auto;
  }
</style>

<form
  class="auth-form pure-form pure-form-stacked"
  on:submit|preventDefault={handleSubmit}>
  <div class="form-control">
    <label for="email">E-Mail</label>
    <input
      on:change={handleInputChange}
      bind:value={formData.email}
      name="email"
      type="email"
      id="email" />
  </div>
  <div class="form-control">
    <label for="password">Password</label>
    <input
      on:change={handleInputChange}
      bind:value={formData.password}
      name="password"
      type="password"
      id="password" />
  </div>
  <div class="form-actions">
    <button
      class="pure-button"
      on:click|preventDefault={handleFormActionChange}>
      Switch to {isLogin ? 'Login' : 'Signup'}
    </button>
    <button class="pure-button pure-button-primary" type="submit">
      Submit
    </button>
  </div>
</form>
