import {Promise} from 'es6-promise';

import {
  GraphQLNonNull
} from 'graphql';

import {
	Region,
	Collection,
} from './types';

import sources from './config/sources';
import backend from './backend';

const TopStories = {
	type: Collection,
	args: {
		region: { type: new GraphQLNonNull(Region) }
	},
	resolve: (root, {region}) => {
		let uuid = sources[`${region}Top`].uuid;

		return backend.page(uuid);
	}
};

const FastFT = {
	type: Collection,
	resolve: (root) => {
		let uuid = sources.fastFt.uuid;

		return backend.byConcept(uuid, 'fastFT');
	}
};

const EditorsPicks = {
	type: Collection,
	resolve: (root) => {
		// HACK this is waiting for editorial to start managing an Editor's picks list
		let config = ['bigRead', 'lunch', 'management', 'frontPageSkyline', 'personInNews', 'lex'];

		let promises = config
		.map((it) => ({
			type: sources[it].type,
			uuid: sources[it].uuid
		}))
		.map((it) => {
			switch(it.type) {
				case 'page':
					return backend.page(it.uuid)
					.then(page => page.items[0]);
				case 'search':
					return backend.search(it.uuid)
					.then(ids => ids[0]);
				default:
					throw "Unknown type: " + it.type;
			}
		})

		return Promise.all(promises)
		.then(ids => ({
			title: "Editor's picks",
			conceptId: null,
			sectionId: null,
			items: ids
		}))
	}
};

const Opinion = {
	type: Collection,
	resolve: (root) => {
		let {uuid, sectionsId} = sources.opinion

		return backend.page(uuid, sectionsId);
	}
};

const Lifestyle = {
	type: Collection,
	resolve: (root) => {
		let {uuid, sectionsId} = sources.lifestyle

		return backend.page(uuid, sectionsId);
	}
};

const Markets = {
	type: Collection,
	resolve: (root) => {
		let {uuid, sectionsId} = sources.markets

		return backend.page(uuid, sectionsId);
	}
};

const Technology = {
	type: Collection,
	resolve: (root) => {
		let {uuid, sectionsId} = sources.technology

		return backend.page(uuid, sectionsId);
	}
};

const Popular = {
	type: Collection,
	resolve: (root) => {
		let url = sources.popular.uuid;

		return backend.popular(url, 'Popular');
	}
}

export default {
	TopStories,
	FastFT,
	EditorsPicks,
	Opinion,
	Lifestyle,
	Markets,
	Technology,
	Popular
}
