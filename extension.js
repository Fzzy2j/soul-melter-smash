const fs = require('fs')

var state = {}
if (fs.existsSync('./smsState.json')) {
	state = JSON.parse(fs.readFileSync("./smsState.json"))
}

module.exports = nodecg => {
	function sendDataUpdate(ignoreId) {
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