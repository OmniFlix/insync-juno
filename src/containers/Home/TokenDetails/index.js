import React, { useState, useEffect } from 'react';
import './index.css';
import * as PropTypes from 'prop-types';
import variables from '../../../utils/variables';
import totalTokens from '../../../assets/userDetails/totalTokens.png';
import stakedTokens from '../../../assets/userDetails/stakedTokens.png';
import unStake from '../../../assets/userDetails/unstake.png';
import rewardsIcon from '../../../assets/userDetails/rewards.svg';
import { connect } from 'react-redux';
import StakeTokensButton from './StakeTokensButton';
import UnDelegateButton from './UnDelegateButton';
import ReDelegateButton from './ReDelegateButton';
import ClaimButton from './ClaimButton';
import { config } from '../../../config';

const TokenDetails = (props) => {
    const staked = props.delegations.reduce((accumulator, currentValue) => {
        return accumulator + Number(currentValue.balance.amount);
    }, 0);
    const balance = props.balance && props.balance.length && props.balance.find((val) => val.denom === config.COIN_MINIMAL_DENOM);
    const available = (balance && balance.amount && Number(balance.amount));
    let unStaked = 0;
    props.unBondingDelegations.map((delegation) => {
        delegation.entries && delegation.entries.length &&
        delegation.entries.map((entry) => {
            unStaked = unStaked + Number(entry.balance);

            return null;
        });
        return null;
    });

    const rewards = props.rewards && props.rewards.total && props.rewards.total.length &&
    props.rewards.total[0] && props.rewards.total[0].amount
        ? props.rewards.total[0].amount / 10 ** config.COIN_DECIMALS : 0;

    const [apr, setApr] = useState(0);
    const [price, setPrice] = useState(0);
    useEffect(() => {
        (async () => {
            const supply = await fetch(`${config.REST_URL}/cosmos/bank/v1beta1/supply/${config.COIN_MINIMAL_DENOM}`).then((r) => r.json()).then(({ amount }) => amount.amount).catch((e) => 0);
            const { inflation } = await fetch(`${config.REST_URL}/cosmos/mint/v1beta1/inflation`).then((r) => r.json()).catch((e) => ({ inflation: 0 }));
            const { pool: { bonded_tokens: bonded } } = await fetch(`${config.REST_URL}/cosmos/staking/v1beta1/pool`).then((r) => r.json()).catch((e) => ({ pool: { bonded_tokens: 0 } }));
            setApr(+supply * +inflation / +bonded * 100);
            const price = await fetch(`https://api-osmosis.imperator.co/tokens/v1/${config.COIN_DENOM.toUpperCase()}`).then((r) => r.json()).then(([{ price }]) => price).catch((e) => 0);
            setPrice(price);
        })();
    }, []);

    function aprToApy(apr, numPeriods) {
        return (1 + (apr / numPeriods))**(numPeriods) - 1;
    }
    const blocksInAYear = (365 * 24 * 60 * 60) / 7.5;
    return (
        <div className="token_details">
            <div className="chip_info">
                <p>Price</p>
                <div className="chip">
                    <img alt="available tokens" src={rewardsIcon}/>
                    <p>${price.toFixed(4)}</p>
                </div>
            </div>
            <div className="chip_info">
                <p>APR</p>
                <div className="chip">
                    <img alt="available tokens" src={rewardsIcon}/>
                    <p>{apr.toFixed(2)}%</p>
                </div>
            </div>
            <div className="chip_info">
                <p>APY</p>
                <div className="chip">
                    <img alt="available tokens" src={rewardsIcon}/>
                    <p>{new Intl.NumberFormat().format(+(aprToApy(apr / 100, blocksInAYear) * 100).toFixed(2)) }%</p>
                </div>
            </div>
            <div style={{width: '100%'}}></div>
            <div className="chip_info">
                <p>{variables[props.lang]['available_tokens']}</p>
                <div className="chip">
                    <img alt="available tokens" src={totalTokens}/>
                    <p>{available / (10 ** config.COIN_DECIMALS)}</p>
                </div>
                <StakeTokensButton/>
            </div>
            <div className="chip_info">
                <p>{variables[props.lang]['staked_tokens']}</p>
                <div className="chip">
                    <img alt="total tokens" src={stakedTokens}/>
                    <p>{staked / (10 ** config.COIN_DECIMALS)}</p>
                </div>
                <div className="buttons_div">
                    <UnDelegateButton/>
                    <span/>
                    <ReDelegateButton/>
                </div>
            </div>
            <div className="chip_info">
                <p>{variables[props.lang].rewards}</p>
                <div className="chip">
                    <img alt="total tokens" src={rewardsIcon}/>
                    <p>{rewards > 0 ? rewards.toFixed(4) : 0}</p>
                </div>
                <div className="buttons_div">
                    <ClaimButton disable={rewards <= 0}/>
                </div>
            </div>
            <div className="chip_info">
                <p>{variables[props.lang]['un_staked_tokens']}</p>
                <div className="chip">
                    <img alt="unstaked tokens" src={unStake}/>
                    <p>{unStaked / (10 ** config.COIN_DECIMALS)}</p>
                </div>
            </div>
        </div>
    );
};

TokenDetails.propTypes = {
    balanceInProgress: PropTypes.bool.isRequired,
    delegationsInProgress: PropTypes.bool.isRequired,
    lang: PropTypes.string.isRequired,
    rewards: PropTypes.shape({
        rewards: PropTypes.array,
        total: PropTypes.array,
    }).isRequired,
    unBondingDelegationsInProgress: PropTypes.bool.isRequired,
    balance: PropTypes.arrayOf(
        PropTypes.shape({
            amount: PropTypes.any,
            denom: PropTypes.string,
        }),
    ),
    delegations: PropTypes.arrayOf(
        PropTypes.shape({
            validator_address: PropTypes.string,
            balance: PropTypes.shape({
                amount: PropTypes.any,
                denom: PropTypes.string,
            }),
        }),
    ),
    unBondingDelegations: PropTypes.arrayOf(
        PropTypes.shape({
            entries: PropTypes.arrayOf(
                PropTypes.shape({
                    balance: PropTypes.string,
                }),
            ),
        }),
    ),
};

const stateToProps = (state) => {
    return {
        delegations: state.accounts.delegations.result,
        delegationsInProgress: state.accounts.delegations.inProgress,
        balance: state.accounts.balance.result,
        balanceInProgress: state.accounts.balance.inProgress,
        unBondingDelegations: state.accounts.unBondingDelegations.result,
        unBondingDelegationsInProgress: state.accounts.unBondingDelegations.inProgress,
        rewards: state.accounts.rewards.result,
    };
};

export default connect(stateToProps, null)(TokenDetails);
