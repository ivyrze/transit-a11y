import React from 'react';
import cx from 'classnames';
import { FaXmark, FaWheelchairMove, FaTriangleExclamation, FaExclamation, FaBan, FaQuestion, FaAsterisk } from 'react-icons/fa6';
import { PiMagnifyingGlassBold, PiXBold, PiPlusCircleFill, PiArrowSquareOut, PiSmileySad, PiArrowLineRightFill, PiArrowLineUpFill, PiArrowLineDownFill, PiElevatorFill, PiEscalatorUpFill, PiChairFill, PiMonitorBold, PiFlameFill, PiCaretUp, PiCaretDown, PiCaretRight, PiDotsThreeBold, PiTrashSimpleFill, PiSignInBold, PiNavigationArrowBold, PiPathBold, PiPencilSimpleFill, PiBookOpenFill, PiCircleNotchBold, PiWarningCircleFill, PiCheckBold, PiUploadSimpleFill, PiArchiveFill, PiClockCounterClockwiseFill, PiLock } from 'react-icons/pi';
import IconRampEntrance from '@assets/images/icon-ramp-entrance.svg?react';
import IconShelter from '@assets/images/icon-shelter.svg?react';
import IconMenu from '@assets/images/icon-menu.svg?react';
import IconUser from '@assets/images/icon-user.svg?react';

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
        auxiliary: FaAsterisk,
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
        book: PiBookOpenFill,
        spinner: PiCircleNotchBold,
        invalid: PiWarningCircleFill,
        check: PiCheckBold,
        upload: PiUploadSimpleFill,
        archive: PiArchiveFill,
        archived: PiClockCounterClockwiseFill,
        lock: PiLock
    };
    
    const altIcons = {
        accessible: primaryIcons.accessible,
        warning: FaExclamation,
        inaccessible: FaXmark,
        unknown: primaryIcons.unknown,
        auxiliary: primaryIcons.auxiliary
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