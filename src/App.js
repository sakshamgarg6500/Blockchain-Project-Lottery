import web3 from "./web3";
import lottery from "./lottery";
import { useState, useEffect } from "react";

function App() {
	//connecting metamask
	// window.ethereum.request({ method: "eth_requestAccounts" }).then((res) => {
	// 	console.log(res);
	// });

	const [manager, setManager] = useState("");
	const [players, setPlayers] = useState([]);
	const [balance, setBalance] = useState("");
	const [etherEnterValue, setEtherEnterValue] = useState("");
	const [message, setMessage] = useState("");

	useEffect(() => {
		async function getManager() {
			const manager = await lottery.methods.manager().call();
			const players = await lottery.methods.returnPlayers().call();
			const balance = await web3.eth.getBalance(lottery.options.address);

			setManager(manager);
			setPlayers(players);
			setBalance(balance);
		}
		getManager();
	}, []);

	async function onSubmit(event) {
		event.preventDefault();

		setMessage("Waiting for transacation success");

		const accounts = await web3.eth.getAccounts();
		await lottery.methods.enter().send({
			from: accounts[0],
			value: web3.utils.toWei(etherEnterValue, "ether"),
		});

		setMessage("You have been entered");
	}

	async function onClick(event) {
		event.preventDefault();
		setMessage("Picking a Winner..");
		const accounts = await web3.eth.getAccounts();
		await lottery.methods.pickWinner().send({ from: accounts[0] });
		setMessage("Winner has been picked");
	}

	return (
		<div>
			<h2>Lottery Contract</h2>
			<p>This contract is managed by {manager}</p>
			<p>
				There are currently {players.length} people entered competeing to win{" "}
				{web3.utils.fromWei(balance, "ether")} ether
			</p>

			<hr></hr>

			<form onSubmit={onSubmit}>
				<h4>Want to try your luck ?</h4>
				<div>
					<label>Amount of ether to enter : </label>
					<input
						value={etherEnterValue}
						onChange={(e) => setEtherEnterValue(e.target.value)}
					></input>
				</div>
				<button>Enter</button>
			</form>

			<hr />

			<h4>Ready to pick a winner ?</h4>
			<button onClick={onClick}>Pick a winner !</button>

			<hr />

			<h1>{message}</h1>
		</div>
	);
}

export default App;

//npm install --save web3
// npm install path-browserify
// npm install --save-dev react-app-rewired crypto-browserify stream-browserify assert stream-http https-browserify os-browserify url buffer process
