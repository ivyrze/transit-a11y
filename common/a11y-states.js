export const accessibilityGroups = new Map([
    [
        "unknown",
        {
            "style": "unknown"
        }
    ],
    [
        "accessible",
        {
            "style": "accessible"
        }
    ],
    [
        "temporary-inaccessible",
        {
            "style": "warning"
        }
    ],
    [
        "complicated",
        {
            "style": "warning"
        }
    ],
    [
        "inaccessible",
        {
            "style": "inaccessible"
        }
    ],
    [
        "auxiliary",
        {
            "style": "auxiliary"
        }
    ]
]);

export const accessibilityStates = new Map([
    [
        "unknown",
        {
            "group": "unknown"
        }
    ],
    [
        "accessible",
        {
            "group": "accessible"
        }
    ],
    [
        "construction",
        {
            "group": "temporary-inaccessible"
        }
    ],
    [
        "other-temporary",
        {
            "group": "temporary-inaccessible"
        }
    ],
    [
        "parking",
        {
            "group": "complicated"
        }
    ],
    [
        "limited-maneuverability",
        {
            "group": "complicated"
        }
    ],
    [
        "poor-conditions",
        {
            "group": "complicated"
        }
    ],
    [
        "other-complicated",
        {
            "group": "complicated"
        }
    ],
    [
        "no-sign",
        {
            "group": "inaccessible"
        }
    ],
    [
        "missing-landing",
        {
            "group": "inaccessible"
        }
    ],
    [
        "insufficient-dimensions",
        {
            "group": "inaccessible"
        }
    ],
    [
        "insufficient-curb",
        {
            "group": "inaccessible"
        }
    ],
    [
        "uneven-surface",
        {
            "group": "inaccessible"
        }
    ],
    [
        "missing-paths",
        {
            "group": "inaccessible"
        }
    ],
    [
        "obstacles",
        {
            "group": "inaccessible"
        }
    ],
    [
        "other-inaccessible",
        {
            "group": "inaccessible"
        }
    ],
    [
        "auxiliary",
        {
            "group": "auxiliary",
            "unreviewable": true
        }
    ]
]);

export const getStateGroup = state => {
    const group = accessibilityStates.get(state).group;
    return accessibilityGroups.get(group);
};

export const getStatePriority = state => {
    const groupPriorities = [ ...accessibilityGroups.keys() ].reverse();
    
    const statePriorities = [ ...accessibilityStates ].sort((a, b) => {
        return (groupPriorities.findIndex(c => c === a[1].group) -
            groupPriorities.findIndex(d => d === b[1].group));
    });
    
    return statePriorities.findIndex(priority => priority[0] === state);
};