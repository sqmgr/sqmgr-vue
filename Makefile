IMG ?= "weters/sqmgr-vue"
VERSION ?= $(shell git describe --always --dirty)
DEPLOY_NAME ?= "sqmgr-vue"

release: docker-build docker-push k8s-deploy

.PHONY: docker-build
docker-build:
	docker build --build-arg version=$(VERSION) -t $(IMG):$(VERSION) .
	docker tag $(IMG):$(VERSION) $(IMG):latest

docker-push:
	docker push $(IMG):$(VERSION)
	docker push $(IMG):latest

.git/hooks/pre-commit:
	ln -s ../../git-hooks/pre-commit .git/hooks/pre-commit

.PHONY: git-hooks
git-hooks: .git/hooks/pre-commit

.PHONY: k8s-deploy
k8s-deploy:
	kubectl set image deploy ${DEPLOY_NAME} nginx=$(IMG):${VERSION} --record
	kubectl rollout status deploy ${DEPLOY_NAME}