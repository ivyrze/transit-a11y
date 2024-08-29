<script>
    import Menu from '$components/primitives/Menu.svelte';
    import MenuItem from '$components/primitives/MenuItem.svelte';
    import Icon from '$components/primitives/Icon.svelte';
    import { authStore } from '$lib/stores.svelte';
    import { jsonFetch } from '$lib/fetch';

    const { review, onEdit, onDelete, onArchive } = $props();

    const isActionable = authStore.role == 'ADMIN' ||
        authStore.username == review.author.username;

    const handleDelete = async () => {
        await jsonFetch({
            url: '/api/delete-review',
            method: 'POST',
            body: { id: review.id }
        });
        onDelete();
    };

    const handleArchive = async () => {
        await jsonFetch({
            url: '/api/archive-review',
            method: 'POST',
            body: { id: review.id }
        });
        onArchive();
    };
</script>

{#if isActionable}
    <Menu>
        {#if authStore.role == 'ADMIN'}
            <MenuItem onclick={ onEdit }>
                <Icon name="pencil" />
                Edit
            </MenuItem>
        {/if}
        <MenuItem onclick={ handleArchive }>
            <Icon name="archive" />
            { !review.archived ?
                "Archive" : "Unarchive"
            }
        </MenuItem>
        <MenuItem onclick={ handleDelete }>
            <Icon name="trash" />
            Delete
        </MenuItem>
    </Menu>
{/if}