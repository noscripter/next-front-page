/* globals describe it */
import fetch from 'isomorphic-fetch';
import {Promise} from 'es6-promise';
global.fetch = fetch;

import chai from 'chai';
import chaiAsPromised from 'chai-as-promised';
chai.use(chaiAsPromised);
const expect = chai.expect;

import graphql from '../../../server/lib/graphql';

describe.only('GraphQL Schema', () => {
	describe('#list', () => {
		it('fetches stories', () => {
			return graphql(false, true)
				.fetch(`
					query List {
						editorsPicks {
							items(limit: 6) {
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
					expect(it.editorsPicks.items.length).to.eq(6);
				});
		});
	});
});
