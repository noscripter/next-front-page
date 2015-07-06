API_KEY := $(shell cat ~/.ftapi 2>/dev/null)
GIT_HASH := $(shell git rev-parse --short HEAD)
TEST_HOST := "ft-next-front-page-${GIT_HASH}"
TEST_URL := "http://ft-next-front-page-${GIT_HASH}.herokuapp.com/uk"
ELASTIC_SEARCH_HOST := $(shell cat ~/.elastic_search_host 2>/dev/null)

.PHONY: test build

install:
	origami-build-tools install --verbose

verify:
	nbt verify

unit-test:
	export apikey=12345; export api2key=67890; export ELASTIC_SEARCH_HOST='asnlasnd.foundcluster.com:9243'; export ELASTIC_SEARCH_HOST='https://asnlasnd.foundcluster.com:9243/v1_api_v2/item'; export HOSTEDGRAPHITE_APIKEY=123; export ENVIRONMENT=production; mocha --recursive --reporter spec tests/server/

# FIXME enable verify for ES6 + JSX, test: verify build-production unit-test
test: build-production unit-test

test-debug:
	mocha --debug-brk --reporter spec -i tests/server/

check-env:
ifeq ($(ELASTIC_SEARCH_HOST),)
	@echo "You need an elasticSearch host!  Speak to one of the next team to get one"
	exit 1
endif
ifeq ($(API_KEY),)
	@echo "You need an api key!  Speak to one of the next team to get one"
	exit 1
endif

run: check-env
	export USER_PREFS_API_KEY=${USER_PREFS_API_KEY}; \
	export ELASTIC_SEARCH_HOST=${ELASTIC_SEARCH_HOST}; \
	export HOSTEDGRAPHITE_APIKEY=123; \
	export apikey=${API_KEY}; \
	export api2key=${API_KEY}; \
	export PORT=${PORT}; \
	nbt run

run-local: check-env
	export USER_PREFS_API_KEY=${USER_PREFS_API_KEY}; \
	export ELASTIC_SEARCH_HOST=${ELASTIC_SEARCH_HOST}; \
	export HOSTEDGRAPHITE_APIKEY=123; \
	export apikey=${API_KEY}; \
	export api2key=${API_KEY}; \
	export PORT=${PORT}; \
	nbt run --local

build:
	nbt build --dev

build-production:
	nbt build

watch:
	nbt build --dev --watch

clean:
	git clean -fxd

tidy:
	nbt destroy ${TEST_HOST}

provision:
	nbt provision ${TEST_HOST}
	nbt configure ft-next-front-page ${TEST_HOST} --overrides "NODE_ENV=branch,DEBUG=*"
	nbt deploy-hashed-assets
	nbt deploy ${TEST_HOST} --skip-enable-preboot
	make smoke

deploy:
	nbt configure
	nbt deploy-hashed-assets
	nbt deploy --skip-enable-preboot

clean-deploy: clean install build-production deploy

smoke:
	@echo "FIXME need saucelabs username and key"
	# export TEST_URL=${TEST_URL}; nbt nightwatch tests/browser/tests/* # FIXME need saucelabs username and key
