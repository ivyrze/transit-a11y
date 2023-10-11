import React from "react";
import { AccessibilityState } from "@components/accessibility-state";
import { Icon } from "@components/icon";
import cx from "classnames";
import i18n from "@assets/i18n-strings.json";

import "@assets/styles/components/tag-list.scss";

export const TagList = props => {
    const { state, tags, className } = props;

    return (
        <ul className={ cx(
            "tag-list",
            className
        ) }>
            { state && (
                <li>
                    <AccessibilityState
                        className="stop-accessibility-state"
                        state={ state }
                        showHeading="group"
                    />
                </li>
            ) }
            { tags?.map(tag => (
                <li className="stop-tag" key={ tag }>
                    <Icon name={ tag } />
                    { i18n.tagLabels[tag] }
                </li>
            )) }
        </ul>
    );
};