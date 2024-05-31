const fs = require('fs')

var state = {
	casterNameLeft: "casterLeft",
	casterHandleLeft: "casterHandleLeft",
	casterNameRight: "casterNameRight",
	casterHandleRight: "casterHandleRight",
	lowerThirdIntroDelay: 1000,
	lowerThirdEnableVideo: true,
	playerLeft: "playerLeft",
	scoreleft: "scoreLeft",
	playerRight: "playerRight",
	scoreRight: "scoreRight",
	inGameEnableVideo: true,
}
if (fs.existsSync('./smsState.json')) {
	state = JSON.parse(fs.readFileSync("./smsState.json"))
}

module.exports = nodecg => {
	function sendDataUpdate(ignoreId) {
		console.log(state);
		state.socketId = ignoreId
		nodecg.sendMessage('smsUpdate', state)
		delete state.socketId
	}
	nodecg.listenFor('smsStateRequest', (id) => {
		sendDataUpdate(id)
	});
	nodecg.listenFor('smsUpdateData', (value) => {
		for (key in value) {
			state[key] = value[key]
		}
		sendDataUpdate(state.socketId)
		delete state.socketId
		const jsonString = JSON.stringify(state)
		fs.writeFile('./smsState.json', jsonString, err => {
			if (err) {
				console.log('Error writing file', err)
			} else {
			}
		})
	})
};