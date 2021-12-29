import React, { useState } from 'react';
import * as PropTypes from 'prop-types';
import variables from '../../utils/variables';
import { initializeChain } from '../../helper';
import {
    fetchRewards,
    fetchVestingBalance,
    getBalance,
    getDelegations,
    getUnBondingDelegations,
    setAccountAddress,
    showSelectAccountDialog,
} from '../../actions/accounts';
import { connect } from 'react-redux';
import { showMessage } from '../../actions/snackbar';
import { encode } from 'js-base64';
import { getDelegatedValidatorsDetails } from '../../actions/stake';

const ConnectButton = (props) => {
    const [inProgress, setInProgress] = useState(false);

    const initKeplr = () => {
        setInProgress(true);
        initializeChain((error, addressList) => {
            setInProgress(false);
            if (error) {
                localStorage.removeItem('of_co_address');
                props.showMessage(error);

                return;
            }

            props.setAccountAddress(addressList[0] && addressList[0].address);
            if (!props.proposalTab) {
                props.getDelegations(addressList[0] && addressList[0].address);
                props.getDelegatedValidatorsDetails(
                    addressList[0] && addressList[0].address
                );
            }
            props.getUnBondingDelegations(
                addressList[0] && addressList[0].address
            );
            props.getBalance(addressList[0] && addressList[0].address);
            props.fetchVestingBalance(addressList[0] && addressList[0].address);
            props.fetchRewards(addressList[0] && addressList[0].address);
            localStorage.setItem(
                'of_co_address',
                encode(addressList[0] && addressList[0].address)
            );
        });
    };

    return (
        <button
            className="inline-flex items-center px-6 py-1.5 text-base font-bold text-white rounded-full shadow-sm disabled:opacity-80 hover:opacity-95 bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            disabled={inProgress}
            variant="contained"
            onClick={initKeplr}
        >
            {inProgress ? 'connecting...' : variables[props.lang].connect}
        </button>
    );
};

ConnectButton.propTypes = {
    fetchRewards: PropTypes.func.isRequired,
    fetchVestingBalance: PropTypes.func.isRequired,
    getBalance: PropTypes.func.isRequired,
    getDelegatedValidatorsDetails: PropTypes.func.isRequired,
    getDelegations: PropTypes.func.isRequired,
    getUnBondingDelegations: PropTypes.func.isRequired,
    lang: PropTypes.string.isRequired,
    setAccountAddress: PropTypes.func.isRequired,
    showDialog: PropTypes.func.isRequired,
    showMessage: PropTypes.func.isRequired,
    proposalTab: PropTypes.bool,
};

const stateToProps = (state) => {
    return {
        lang: state.language,
    };
};

const actionsToProps = {
    showMessage,
    setAccountAddress,
    showDialog: showSelectAccountDialog,
    getDelegations,
    getDelegatedValidatorsDetails,
    fetchVestingBalance,
    getBalance,
    getUnBondingDelegations,
    fetchRewards,
};

export default connect(stateToProps, actionsToProps)(ConnectButton);
