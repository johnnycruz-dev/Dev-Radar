const axios = require('axios');
const Dev = require('../models/Dev');
const parseStringAsArray = require('../utils/parseStringAsArray');

module.exports = {
	async index (req, res) {
		const devs = await Dev.find();

		return res.json(devs);
	},

	async store (req, res) {
		const { github_username, techs, latitude, longitude } = req.body;

		let dev = await Dev.findOne({ github_username });

		if(!dev) {
			const apiResponse = await axios.get(`https://api.github.com/users/${github_username}`);
		
			const { name = login, avatar_url, bio } = apiResponse.data;
		
			const techsArray = parseStringAsArray(techs);
		
			const location = {
				type: 'Point',
				coordinates: [longitude, latitude],
			};
		
			dev = await Dev.create({
				github_username,
				name,
				avatar_url,
				bio,
				techs: techsArray,
				location
			})
		}
	
		return res.json(dev);
	},

	async update (req, res) {
		const { github_username } = req.params;
		const { name, avatar_url, bio, techs, longitude, latitude } = req.body;

		let dev = await Dev.findOne({ github_username });

		const techsArray = parseStringAsArray(techs);
		
		const location = {
			type: 'Point',
			coordinates: [longitude, latitude],
		};
	
		dev = await Dev.updateOne(dev,{
			name,
			avatar_url,
			bio,
			techs: techsArray,
			location
		})

		console.log(dev);

		return res.json(dev);
	},

	async destroy (req, res) {
		const { github_username } = req.params;

		let dev = await Dev.findOne({ github_username });

		dev = await Dev.deleteOne(dev);

		return res.json({ Message: 'Deletado com sucesso!' });
	}
};