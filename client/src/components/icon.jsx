import React from 'react';
import cx from 'classnames';
import { FaXmark, FaWheelchairMove, FaTriangleExclamation, FaExclamation, FaBan, FaQuestion } from 'react-icons/fa6';
import { PiMagnifyingGlassBold, PiXBold, PiPlusCircleFill, PiArrowSquareOut, PiSmileySad, PiArrowLineRightFill, PiArrowLineUpFill, PiArrowLineDownFill, PiElevatorFill, PiEscalatorUpFill, PiChairFill, PiMonitorBold, PiFlameFill, PiCaretUp, PiCaretDown, PiCaretRight, PiDotsThreeBold, PiTrashSimpleFill, PiSignInBold, PiNavigationArrowBold, PiPathBold, PiPencilSimpleFill, PiHeartFill, PiBookOpenFill, PiCircleNotchBold, PiWarningCircleFill, PiCheckBold } from 'react-icons/pi';
import { ReactComponent as IconRampEntrance } from '@assets/images/icon-ramp-entrance.svg';
import { ReactComponent as IconShelter } from '@assets/images/icon-shelter.svg';
import { ReactComponent as IconMenu } from '@assets/images/icon-menu.svg';
import { ReactComponent as IconUser } from '@assets/images/icon-user.svg';

import '@assets/styles/components/icon.scss';

export const Icon = (props) => {
    const { name, alt, className, ...passthroughProps } = props;
    
    const primaryIcons = {
        search: PiMagnifyingGlassBold,
        close: PiXBold,
        add: PiPlusCircleFill,
        link: PiArrowSquareOut,
        error: PiSmileySad,
        accessible: FaWheelchairMove,
        warning: FaTriangleExclamation,
        inaccessible: FaBan,
        unknown: FaQuestion,
        'at-grade': PiArrowLineRightFill,
        'above-grade': PiArrowLineUpFill,
        'below-grade': PiArrowLineDownFill,
        elevator: PiElevatorFill,
        escalator: PiEscalatorUpFill,
        'ramp-entrance': IconRampEntrance,
        bench: PiChairFill,
        shelter: IconShelter,
        display: PiMonitorBold,
        heating: PiFlameFill,
        'chevron-up': PiCaretUp,
        'chevron-down': PiCaretDown,
        'chevron-right': PiCaretRight,
        ellipsis: PiDotsThreeBold,
        trash: PiTrashSimpleFill,
        user: IconUser,
        login: PiSignInBold,
        menu: IconMenu,
        location: PiNavigationArrowBold,
        route: PiPathBold,
        pencil: PiPencilSimpleFill,
        donation: PiHeartFill,
        book: PiBookOpenFill,
        spinner: PiCircleNotchBold,
        invalid: PiWarningCircleFill,
        check: PiCheckBold
    };
    
    const altIcons = {
        accessible: primaryIcons.accessible,
        warning: FaExclamation,
        inaccessible: FaXmark,
        unknown: primaryIcons.unknown,
    };
    
    const IconChild = !alt ? primaryIcons[name] : altIcons[name];
    
    return (
        <span
            className={ cx(
                "icon",
                "icon-" + name,
                alt && "icon-alt",
                className
            ) }
            { ...passthroughProps }
        >
            <IconChild aria-hidden="true" />
        </span>
    );
};