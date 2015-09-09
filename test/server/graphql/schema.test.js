/* globals describe it */
import fetch from 'isomorphic-fetch';
import {Promise} from 'es6-promise';
global.fetch = fetch;

import chai from 'chai';
chai.should();

import graphql from '../../../server/lib/graphql';

describe('GraphQL Schema', () => {
	describe('#list', () => {
		it('fetches list', () => {
			return graphql(false, true, { flags: { editorsPicksFromList: true } })
				.fetch(`
					query List {
						editorsPicks {
							items(limit: 2) {
								type: __typename
								contentType
								id
								title
								lastPublished
							}
						}
					}
				`)
				.then(it => {
					it.editorsPicks.items.length.should.eq(2);
					it.editorsPicks.items.forEach(item => {
						item.contentType.should.exist;
						item.id.should.exist;
						item.title.should.exist;
						item.lastPublished.should.exist;
					});
				});
		});
	});
});
