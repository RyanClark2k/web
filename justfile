setup-frontend:
  pnpm i

run-frontend:
  cd config/webpack && npx webpack serve

run-backend:
  cd src/app/cmd && go run server.go

validate-repo:
   npx eslint . --ext .jsx --ext .js --ext .ts --ext .tsx
   npx stylelint "{src,config}/**/*.{css,scss,sass}" --config .stylelintrc.json
