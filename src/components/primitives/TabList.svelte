<script>
    import { melt, createTabs } from '@melt-ui/svelte';
    import { setContext } from 'svelte';

    import '$assets/styles/components/tab-list.scss';

    const { defaultValue, tabs, children } = $props();

    const tabStore = createTabs({
        defaultValue
    });
    setContext("tab-list", tabStore);

    const {
        elements: { root, list }
    } = tabStore;
</script>

<div use:melt={ $root }>
    <div
        class="tab-list"
        use:melt={ $list }
    >
        {@render tabs()}
    </div>
    {@render children()}
</div>