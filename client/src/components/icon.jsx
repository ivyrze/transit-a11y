import React from 'react';
import { FaMagnifyingGlass, FaXmark, FaCirclePlus, FaArrowUpRightFromSquare, FaFaceFrown, FaWheelchairMove, FaTriangleExclamation, FaBan, FaQuestion, FaArrowRightFromBracket, FaArrowsUpToLine, FaArrowsDownToLine, FaElevator, FaStairs, FaChair, FaPersonShelter, FaTv, FaFire, FaChevronDown, FaEllipsis, FaTrashCan, FaUser, FaDoorOpen, FaLocationArrow, FaRoute, FaPencil, FaHandHoldingHeart, FaBookOpenReader, FaExclamation } from 'react-icons/fa6';
import { ReactComponent as IconRampEntrance } from '@assets/images/icon-ramp-entrance.svg';
import { ReactComponent as IconMenu } from '@assets/images/icon-menu.svg';

export const Icon = props => {
    const { name, alt } = props;
    
    const altClass = alt ? " icon-alt" : "";
    
    const primaryIcons = {
        search: FaMagnifyingGlass,
        close: FaXmark,
        add: FaCirclePlus,
        link: FaArrowUpRightFromSquare,
        error: FaFaceFrown,
        accessible: FaWheelchairMove,
        warning: FaTriangleExclamation,
        inaccessible: FaBan,
        unknown: FaQuestion,
        'at-grade': FaArrowRightFromBracket,
        'above-grade': FaArrowsUpToLine,
        'below-grade': FaArrowsDownToLine,
        elevator: FaElevator,
        escalator: FaStairs,
        'ramp-entrance': IconRampEntrance,
        bench: FaChair,
        shelter: FaPersonShelter,
        display: FaTv,
        heating: FaFire,
        chevron: FaChevronDown,
        ellipsis: FaEllipsis,
        trash: FaTrashCan,
        user: FaUser,
        login: FaDoorOpen,
        menu: IconMenu,
        location: FaLocationArrow,
        route: FaRoute,
        pencil: FaPencil,
        donation: FaHandHoldingHeart,
        book: FaBookOpenReader
    };
    
    const altIcons = {
        accessible: primaryIcons.accessible,
        warning: FaExclamation,
        inaccessible: primaryIcons.close,
        unknown: primaryIcons.unknown,
    };
    
    const IconChild = !alt ? primaryIcons[name] : altIcons[name];
    
    return (
        <span
            className={ "icon icon-" + name + altClass }
            aria-hidden="true"
        >
            <IconChild />
        </span>
    );
};