<script>
    import clsx from 'clsx';
    import IconSearch from '~icons/ph/magnifying-glass-bold';
    import IconClose from '~icons/ph/x-bold';
    import IconAdd from '~icons/ph/plus-circle-fill';
    import IconLink from '~icons/ph/arrow-square-out';
    import IconError from '~icons/ph/smiley-sad';
    import IconAccessible from '~icons/fa6-solid/wheelchair-move';
    import IconWarning from '~icons/fa6-solid/triangle-exclamation';
    import IconWarningAlt from '~icons/fa6-solid/exclamation';
    import IconInaccessible from '~icons/fa6-solid/ban';
    import IconInaccessibleAlt from '~icons/fa6-solid/xmark';
    import IconUnknown from '~icons/fa6-solid/question';
    import IconAuxiliary from '~icons/fa6-solid/asterisk';
    import IconAtGrade from '~icons/ph/arrow-line-right-fill';
    import IconAboveGrade from '~icons/ph/arrow-line-up-fill';
    import IconBelowGrade from '~icons/ph/arrow-line-down-fill';
    import IconElevator from '~icons/ph/elevator-fill';
    import IconEscalator from '~icons/ph/escalator-up-fill';
    import IconRampEntrance from '~icons/custom/icon-ramp-entrance';
    import IconBench from '~icons/ph/chair-fill';
    import IconShelter from '~icons/custom/icon-shelter';
    import IconDisplay from '~icons/ph/monitor-bold';
    import IconHeating from '~icons/ph/flame-fill';
    import IconChevronUp from '~icons/ph/caret-up';
    import IconChevronDown from '~icons/ph/caret-down';
    import IconChevronRight from '~icons/ph/caret-right';
    import IconEllipsis from '~icons/ph/dots-three-bold';
    import IconTrash from '~icons/ph/trash-simple-fill';
    import IconUser from '~icons/custom/icon-user';
    import IconLogin from '~icons/ph/sign-in-bold';
    import IconMenu from '~icons/custom/icon-menu';
    import IconLocation from '~icons/ph/navigation-arrow-bold';
    import IconRoute from '~icons/ph/path-bold';
    import IconPencil from '~icons/ph/pencil-simple-fill';
    import IconBook from '~icons/ph/book-open-fill';
    import IconSpinner from '~icons/ph/circle-notch-bold';
    import IconInvalid from '~icons/ph/warning-circle-fill';
    import IconCheck from '~icons/ph/check-bold';
    import IconUpload from '~icons/ph/upload-simple-fill';
    import IconArchive from '~icons/ph/archive-fill';
    import IconArchived from '~icons/ph/clock-counter-clockwise-fill';
    import IconLock from '~icons/ph/lock';
    import IconPerspective from '~icons/ph/eye-bold';

    import '$assets/styles/components/icon.scss';

    const { name, alt, class: className = '', ...passthroughProps } = $props();
    
    const primaryIcons = {
        search: IconSearch,
        close: IconClose,
        add: IconAdd,
        link: IconLink,
        error: IconError,
        accessible: IconAccessible,
        warning: IconWarning,
        inaccessible: IconInaccessible,
        unknown: IconUnknown,
        auxiliary: IconAuxiliary,
        'at-grade': IconAtGrade,
        'above-grade': IconAboveGrade,
        'below-grade': IconBelowGrade,
        elevator: IconElevator,
        escalator: IconEscalator,
        'ramp-entrance': IconRampEntrance,
        bench: IconBench,
        shelter: IconShelter,
        display: IconDisplay,
        heating: IconHeating,
        'chevron-up': IconChevronUp,
        'chevron-down': IconChevronDown,
        'chevron-right': IconChevronRight,
        ellipsis: IconEllipsis,
        trash: IconTrash,
        user: IconUser,
        login: IconLogin,
        menu: IconMenu,
        location: IconLocation,
        route: IconRoute,
        pencil: IconPencil,
        book: IconBook,
        spinner: IconSpinner,
        invalid: IconInvalid,
        check: IconCheck,
        upload: IconUpload,
        archive: IconArchive,
        archived: IconArchived,
        lock: IconLock,
        perspective: IconPerspective
    };
    
    const altIcons = {
        accessible: primaryIcons.accessible,
        warning: IconWarningAlt,
        inaccessible: IconInaccessibleAlt,
        unknown: primaryIcons.unknown,
        auxiliary: primaryIcons.auxiliary
    };
    
    const IconChild = $derived(
        !alt ? primaryIcons[name] : altIcons[name]
    );
</script>

<span
    class={ clsx(
        "icon", "icon-" + name, { "icon-alt": alt }, className
    ) }
    { ...passthroughProps }
>
    <IconChild aria-hidden="true" />
</span>