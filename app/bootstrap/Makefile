AWS_GITHUB_PWD_SECRET_NAME = /concourse/schema-manager/github_pat
AWS_GITHUB_WEBHOOK_TOKEN_NAME = /concourse/schema-manager/schema-manager-app-webhook-token
AWS_REGION ?= eu-west-1

build: docker-compose
	docker-compose build concourse-setup

concourse-login:
	fly login -t schema-manager --team-name schema-manager --concourse-url https://concourse.at.sky
	
concourse-apply-pipeline: docker-compose
	docker-compose run --rm concourse-setup bash -c 'fly -t schema-manager set-pipeline --pipeline schema-manager-app-generator --config ./ci/pipelines/pipeline_generator.yaml -n && fly -t schema-manager  unpause-pipeline  --pipeline schema-manager-app-generator'

concourse-apply-pr-pipeline: docker-compose
	docker-compose run --rm concourse-setup bash -c 'fly -t schema-manager set-pipeline --pipeline schema-manager-app-pr --config ./ci/pipelines/check.yaml -n'

concourse-apply-deploy-pipeline: docker-compose
	docker-compose run --rm concourse-setup bash -c 'fly -t schema-manager set-pipeline --pipeline schema-manager-app-deploy --config ./ci/pipelines/deploy.yaml -n'

aws-create-git-token: docker-compose
	@read -p "Enter Github bot user PAT token for svc-adtech-cicd-bot account:" secret_value; \
	docker-compose run --rm concourse-setup bash -c 'aws secretsmanager create-secret --name $(AWS_GITHUB_PWD_SECRET_NAME) --description "Github bot PAT token" --secret-string "$$secret_value" --region $(AWS_REGION);'
	
aws-update-git-token: docker-compose
	@read -p "Enter Github bot user PAT token:" secret_value; \
	docker-compose run --rm concourse-setup bash -c 'aws secretsmanager put-secret-value --secret-id $(AWS_GITHUB_PWD_SECRET_NAME) --secret-string "$$secret_value" --region $(AWS_REGION);'	
	
aws-create-webhook-token: docker-compose	
	docker-compose run --rm concourse-setup bash -c 'aws secretsmanager create-secret --name $(AWS_GITHUB_WEBHOOK_TOKEN_NAME) --description "Github webhook token" --secret-string "$(shell uuidgen)" --region $(AWS_REGION);'
	
aws-update-webhook-token: docker-compose	
	docker-compose run --rm concourse-setup bash -c 'aws secretsmanager put-secret-value --secret-id $(AWS_GITHUB_WEBHOOK_TOKEN_NAME) --secret-string "$(shell uuidgen)" --region $(AWS_REGION);'

# Dependencies
docker-compose: docker
	docker-compose version || (echo "Could not find Docker Compose"; exit 1)

docker:
	docker -v || (echo "Could not find Docker"; exit 1)
