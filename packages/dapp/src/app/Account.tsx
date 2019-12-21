import React, { useState, useCallback, memo } from 'react';
import { useEtherProvider, useAccount } from 'use-ether-provider';
import { ContractFactory, Contract } from 'ethers';
import { parseEther, formatEther, bigNumberify, BigNumber } from 'ethers/utils';
import useContract from '../shared/hooks/useContract';
import safeRandomNumber from '../shared/security/safeRandomNumber';
import { Hasher, RPS } from '../contracts.json';
import { Move } from '../game/store/models';

interface SelectMoveProps {
  onSelect: (...args: any[]) => void;
  value: Move;
}

const labels = {
  [Move.Null]: '',
  [Move.Rock]: 'Rock',
  [Move.Paper]: 'Paper',
  [Move.Scissors]: 'Scissors',
  [Move.Spock]: 'Spock',
  [Move.Lizard]: 'Lizard',
};

let SelectMove: React.SFC<SelectMoveProps> = ({ onSelect, value }) => {
  return (
    <React.Fragment>
      <label>Select Move:</label>
      <select value={value} onChange={onSelect}>
        {Object.entries(labels).map(([value, label]) => (
          <option key={label} value={value}>
            {label}
          </option>
        ))}
      </select>
    </React.Fragment>
  );
};
SelectMove = memo(SelectMove);

const Account: React.SFC<{}> = () => {
  const provider = useEtherProvider();
  const myAddress = useAccount(provider!);
  const hasherContract = useContract(Hasher.addresses['4'], Hasher.abi);
  const RPSFactory = new ContractFactory(
    RPS.abi,
    RPS.bytecode.object,
    provider!.getSigner(myAddress)
  );

  const [playerTwo, setPlayerTwo] = useState('');
  const handleChangePlayerTwo = useCallback(evt => {
    const { value } = evt.target;
    setPlayerTwo(value);
  }, []);

  const [stake, setStake] = useState(0.01);
  const handleChangeStake = useCallback(evt => {
    const { value } = evt.target;
    setStake(Number.parseFloat(value));
  }, []);

  const [playerOneMove, setPlayerOneMove] = useState(Move.Null);
  const handleChangePlayerOneMove = useCallback(evt => {
    const { value } = evt.target;
    setPlayerOneMove(Number(value));
  }, []);
  const [salt, setSalt] = useState('');

  const [currentGameAddress, setCurrentGameAddress] = useState('');
  const handleChangeCurrentGameAddress = useCallback(evt => {
    const { value } = evt.target;
    setCurrentGameAddress(value);
  }, []);

  const [currentGameStats, setCurrentGameStats] = useState({
    stake: '',
    playerOne: '',
    playerOneCommitment: '',
    playerTwo: '',
    playerTwoMove: Move.Null,
  });

  const handleCreateGame = useCallback(async () => {
    if (!playerTwo) {
      return alert('No player 2 address provided');
    }

    if (playerTwo === myAddress) {
      return alert('You cannot bet against yourself');
    }

    if (stake <= 0) {
      return alert('Should provide a valid stake');
    }

    if (playerOneMove === Move.Null) {
      return alert('Please select a valid move!');
    }

    const newSalt = safeRandomNumber();
    setSalt(newSalt.toHexString());

    const playerOneCommitment = await hasherContract.hash(
      playerOneMove,
      newSalt
    );

    const contract = await RPSFactory.deploy(playerOneCommitment, playerTwo, {
      value: parseEther(String(stake)),
    });
    console.log(contract.address);
    await contract.deployed();
    alert('New game is on!');
  }, [RPSFactory, hasherContract, myAddress, playerOneMove, playerTwo, stake]);

  const handleConnectGame = useCallback(async () => {
    const contract = new Contract(currentGameAddress, RPS.abi, provider!);
    const [
      stake,
      playerOne,
      playerOneCommitment,
      playerTwo,
      playerTwoMove,
    ] = await Promise.all([
      contract.stake(),
      contract.j1(),
      contract.c1Hash(),
      contract.j2(),
      contract.c2(),
    ]);
    setCurrentGameStats({
      stake: formatEther(stake),
      playerOne,
      playerOneCommitment,
      playerTwo,
      playerTwoMove,
    });
  }, [currentGameAddress, provider]);

  const [playerTwoMove, setPlayerTwoMove] = useState(Move.Null);
  const handleChangePlayerTwoMove = useCallback(evt => {
    const { value } = evt.target;
    setPlayerTwoMove(Number(value));
  }, []);

  const handlePlay = useCallback(async () => {
    if (myAddress !== currentGameStats.playerTwo) {
      return alert('Not allowed because you are not the player two!');
    }

    if (playerTwoMove === Move.Null) {
      return alert('Please select a valid move!');
    }

    if (!currentGameStats.stake || !currentGameStats.playerOneCommitment) {
      return alert('Not connected to a valid game');
    }

    const contract = new Contract(
      currentGameAddress,
      RPS.abi,
      provider!
    ).connect(provider!.getSigner(myAddress));
    const txn = await contract.play(playerTwoMove, {
      value: parseEther(String(currentGameStats.stake)),
    });

    await txn.wait();
    alert('OK!');
  }, [
    currentGameAddress,
    currentGameStats.playerOneCommitment,
    currentGameStats.playerTwo,
    currentGameStats.stake,
    myAddress,
    playerTwoMove,
    provider,
  ]);

  const [revealMove, setRevealMove] = useState(Move.Null);
  const handleChangeRevealMove = useCallback(evt => {
    const { value } = evt.target;
    setRevealMove(Number(value));
  }, []);
  const [revealSalt, setRevealSalt] = useState<string>('');
  const handleChangeRevealSalt = useCallback(evt => {
    const { value } = evt.target;
    setRevealSalt(value);
  }, []);
  const handleReveal = useCallback(async () => {
    if (!revealMove) {
      return alert('Please select a valid move');
    }
    if (!revealSalt) {
      return alert('Please provide a salt value');
    }

    const contract = new Contract(
      currentGameAddress,
      RPS.abi,
      provider!
    ).connect(provider!.getSigner(myAddress));

    const txn = await contract.solve(revealMove, bigNumberify(revealSalt));
    await txn.wait();
    alert('Solved');
  }, [currentGameAddress, myAddress, provider, revealMove, revealSalt]);

  return (
    <div>
      <div>My Address: {myAddress}</div>
      <div>
        Player 2 Address:
        <input type="text" value={playerTwo} onChange={handleChangePlayerTwo} />
      </div>
      <div>
        Stake:
        <input
          type="number"
          step="0.01"
          value={stake}
          onChange={handleChangeStake}
        />
      </div>
      <div>
        <SelectMove
          value={playerOneMove}
          onSelect={handleChangePlayerOneMove}
        />
      </div>
      <div>
        Salt:
        <input type="text" readOnly value={salt} />
      </div>
      <button onClick={handleCreateGame}>New Game</button>
      <hr />
      <div>
        Attach to game:{' '}
        <input
          type="text"
          value={currentGameAddress}
          onChange={handleChangeCurrentGameAddress}
        />
      </div>
      <button onClick={handleConnectGame}>Connect</button>
      <div>Current stake: {currentGameStats.stake}</div>
      <div>Player One: {currentGameStats.playerOne}</div>
      <div>Player One Hashed Move: {currentGameStats.playerOneCommitment}</div>
      <div>Player Two: {currentGameStats.playerTwo}</div>
      <div>Player Two Move: {currentGameStats.playerTwoMove}</div>
      <div>
        <SelectMove
          value={playerTwoMove}
          onSelect={handleChangePlayerTwoMove}
        />
      </div>
      <button onClick={handlePlay}>Play</button>
      <hr />
      <h2>Reveal</h2>
      <div>
        <SelectMove value={revealMove} onSelect={handleChangeRevealMove} />
      </div>
      <div>
        Salt:
        <input value={revealSalt} onChange={handleChangeRevealSalt} />
      </div>
      <button onClick={handleReveal}>Reveal</button>
    </div>
  );
};

export default Account;
