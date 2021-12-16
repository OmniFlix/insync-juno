import { makeStyles, TextField as MaterialTextField } from '@material-ui/core';
import classNames from 'classnames';
import * as PropTypes from 'prop-types';
import React from 'react';
import './index.css';

const useStyles = makeStyles(() => ({
    root: {
        '& .MuiOutlinedInput-root': {
            '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                borderColor: '#696969',
                borderWidth: '1px',
            },
            '&.Mui-error .MuiOutlinedInput-notchedOutline': {
                borderColor: 'red',
            },
        },
        '& .MuiFormHelperText-root': {
            '&.Mui-error': {
                width: '100%',
                margin: '-6px 0',
            },
        },
        ':-webkit-autofill': {
            WebkitBoxShadow: '0 0 0 1000px white inset',
            backgroundColor: 'red !important',
        },
    },
}));

const TextField = (props) => {
    const onChange = (e) => {
        // Prevents cursor from jumping to the end of the input (see https://stackoverflow.com/a/62433499)
        // input.type of 'text' for numeric inputs is required in order to enable setting of selectionStart and selectionEnd
        const caret = e.currentTarget.selectionStart;
        const element = e.target;
        window.requestAnimationFrame(() => {
            try {
                element.selectionStart = caret;
                element.selectionEnd = caret;
            } catch (err) {
                console.error(err);
            }
        });
        // manually handle numeric input.
        if (props.type === 'number') {
            const parsedNumber = +(e.target.value);
            if (Number.isNaN(parsedNumber)) {
                e.target.value = +props.value ? props.value : '0';
            }
            props.onChange(e.target.value);
        } else {
            props.onChange(e.target.value);
        }
    };

    return (
        <MaterialTextField
            InputProps={props.inputProps ? props.inputProps : null}
            className={classNames(useStyles().root, 'text_field', props.className ? props.className : '')}
            disabled={props.disable ? props.disable : null}
            error={props.error}
            helperText={props.error
                ? <span className="error">
                    {props.errorText}
                </span>
                : ''}
            id={props.id}
            // ensures that manually parsed numeric inputs are displayed as numbers
            inputMode={props.type === 'number' ? 'numeric' : 'text'}
            margin="normal"
            multiline={props.multiline ? props.multiline : false}
            name={props.name}
            placeholder={props.placeholder}
            type={props.type && props.type !== 'number' ? props.type : 'text'}
            value={props.value}
            variant="outlined"
            onChange={onChange}/>
    );
};

TextField.propTypes = {
    id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    onChange: PropTypes.func.isRequired,
    className: PropTypes.string,
    disable: PropTypes.bool,
    error: PropTypes.bool,
    errorText: PropTypes.string,
    inputProps: PropTypes.object,
    multiline: PropTypes.bool,
    placeholder: PropTypes.string,
    type: PropTypes.string,
    value: PropTypes.any,
};

export default TextField;
