API_KEY := $(shell cat ~/.ftapi 2>/dev/null)
TEST_HOST := "ft-next-front-page-${CIRCLE_BUILD_NUM}"
TEST_URL := "http://ft-next-front-page-${CIRCLE_BUILD_NUM}.herokuapp.com"

.PHONY: test build

install:
	origami-build-tools install --verbose

verify:
	nbt verify

# FIXME enable verify for ES6 + JSX, test: verify build-production unit-test
test: build-production

run:
	nbt run

run-local:
	nbt run --local

build:
	nbt build --dev --skip-js
	webpack

build-production:
	NODE_ENV=production nbt build
	nbt about

watch:
	nbt build --dev --skip-js --watch & webpack --watch

clean:
	git clean -fxd

tidy:
	nbt destroy ${TEST_HOST}

provision:
	nbt provision ${TEST_HOST}
	nbt configure ft-next-front-page ${TEST_HOST} --overrides "NODE_ENV=branch"
	nbt deploy-hashed-assets
	nbt deploy ${TEST_HOST} --skip-enable-preboot --docker
	make smoke

deploy:
	nbt configure
	nbt deploy-hashed-assets
	nbt deploy --docker

clean-deploy: clean install build-production deploy

smoke:
	nbt test-urls ${TEST_HOST}
	export TEST_URL=${TEST_URL}; nbt nightwatch test/browser/tests/*
