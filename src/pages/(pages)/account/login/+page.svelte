<script>
    import Form from '$components/primitives/Form.svelte';
    import FormInput from '$components/primitives/FormInput.svelte';
    import FormSubmit from '$components/primitives/FormSubmit.svelte';
    import Link from '$components/primitives/Link.svelte';
    import { authStore } from '$lib/stores.svelte';

    const handleFormResponse = response => {
        authStore.update(response);
        authStore.login();
    };
</script>

<svelte:head>
    <title>Login | is the metro accessible?</title>
</svelte:head>

<main class="form-fullscreen">
    <h1>Login</h1>
    <Form
        action="/api/account/login"
        method="POST"
        autocomplete="off"
        autocorrect="off"
        spellcheck="false"
        onResponse={ handleFormResponse }
    >
        <fieldset>
            <div class="form-infield">
                <FormInput
                    name="username"
                    type="text"
                    autocomplete="username"
                    required
                >
                    Username
                </FormInput>
            </div>
            <div class="form-infield">
                <FormInput
                    name="password"
                    type="password"
                    autocomplete="current-password"
                    minlength="10"
                    required
                >
                    Password
                </FormInput>
            </div>
        </fieldset>
        <fieldset>
            <FormSubmit />
        </fieldset>
        <p>Don't have an account? <Link href="/account/sign-up" class="link--regular">Sign up with an invite code</Link>.</p>
    </Form>
</main>