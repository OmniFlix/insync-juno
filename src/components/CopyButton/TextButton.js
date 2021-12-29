import { Tooltip } from '@material-ui/core';
import * as PropTypes from 'prop-types';
import React from 'react';
import './index.css';

const CopyButton = (props) => {
    const [open, setOpen] = React.useState(false);

    const handleClose = () => {
        setOpen(false);
    };

    const handleCopy = (e) => {
        navigator &&
            navigator.clipboard &&
            navigator.clipboard.writeText(props.data);

        e.stopPropagation();
        setOpen(true);
        setTimeout(handleClose, 1000);
    };

    return (
        <Tooltip arrow open={open} title="Copied!">
            <button
                style={{ fontFamily: "'Blinker', sans-serif" }}
                className="bg-white text-black py-1.5 px-4 rounded-full ml-4 mt-0.5 font-bold text-xs hover:bg-slate-200 transition duration-75"
                onClick={handleCopy}
            >
                {props.children}
            </button>
        </Tooltip>
    );
};

CopyButton.propTypes = {
    children: PropTypes.string.isRequired,
    data: PropTypes.any,
};

export default CopyButton;
