<script>
    import Form from '$components/primitives/Form.svelte';
    import FormInput from '$components/primitives/FormInput.svelte';
    import FormSubmit from '$components/primitives/FormSubmit.svelte';
    import { authStore } from '$lib/stores.svelte';

    const handleFormResponse = response => {
        authStore.update(response);
        authStore.login();
    };
</script>

<svelte:head>
    <title>Sign up | is the metro accessible?</title>
</svelte:head>

<main class="form-fullscreen">
    <h1>Sign up</h1>
    <Form
        action="/api/account/sign-up"
        method="POST"
        autoComplete="off"
        autoCorrect="off"
        spellCheck="false"
        onResponse={ handleFormResponse }
    >
        <p>At this time, community reviews are in private beta. If you've been given an invite code, enter it below to get started.</p>
        <fieldset>
            <div class="form-infield">
                <FormInput
                    name="invite"
                    type="text"
                    required
                >
                    Invitation code
                </FormInput>
            </div>
        </fieldset>
        <fieldset>
            <legend>Account credentials</legend>
            <div class="form-infield">
                <FormInput
                    name="email"
                    type="email"
                    required
                >
                    Your email address
                </FormInput>
            </div>
            <div class="form-infield">
                <FormInput
                    name="username"
                    type="text"
                    autocomplete="username"
                    required
                >
                    Create a username
                </FormInput>
            </div>
            <div class="form-infield">
                <FormInput
                    name="password"
                    type="password"
                    autocomplete="new-password"
                    minlength="10"
                    required
                >
                    Create a password
                </FormInput>
            </div>
        </fieldset>
        <fieldset class="button-set">
            <FormSubmit />
        </fieldset>
    </Form>
</main>