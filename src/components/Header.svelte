<script>
    import clsx from 'clsx';
    import Link from '$components/primitives/Link.svelte';
    import Icon from '$components/primitives/Icon.svelte';
    import Menu from '$components/primitives/Menu.svelte';
    import MenuGroup from '$components/primitives/MenuGroup.svelte';
    import MenuItem from '$components/primitives/MenuItem.svelte';
    import { authStore } from '$lib/stores.svelte';

    import '$assets/styles/components/header.scss';

    const { minimal, menu = true, children } = $props();
</script>

<header
    class={ clsx(
        "global-header",
        minimal ? "header--minimal" : "header--regular"
    ) }
>
    <Link
        href="/"
        class="title link--minimal"
        currentAware
    >
        is the metro accessible?
    </Link>
    {#if menu}
        <div id="main-menu">
            <Menu
                triggerIcon="menu"
                aria-label="Toggle main menu"
            >
                <MenuGroup label="About">
                    <MenuItem
                        type="link"
                        href="/about"
                        currentAware
                    >
                        <Icon name="book" />
                        About the project
                    </MenuItem>
                </MenuGroup>
                <MenuGroup label="View">
                    <MenuItem
                        type="link"
                        href="/routes"
                        currentAware
                    >
                        <Icon name="route" />
                        Route explorer
                    </MenuItem>
                    <MenuItem
                        type="link"
                        href="/perspectives"
                        currentAware
                    >
                        <Icon name="perspective" />
                        Switch perspectives
                    </MenuItem>
                </MenuGroup>
                <MenuGroup label="User">
                    {#if authStore.username}
                        <MenuItem
                            type="link"
                            href={ "/profile/" + authStore.username }
                            currentAware
                        >
                            <Icon name="user" />
                            Your profile
                        </MenuItem>
                        <MenuItem
                            type="link"
                            href="/account/logout"
                            currentAware
                            data-sveltekit-preload-data="false"
                        >
                            <Icon name="login" />
                            Logout
                        </MenuItem>
                    {:else}
                        <MenuItem
                            type="link"
                            href="/account/login"
                            currentAware
                        >
                            <Icon name="login" />
                            Login
                        </MenuItem>
                    {/if}
                </MenuGroup>
            </Menu>
        </div>
    {/if}
    {@render children?.()}
</header>