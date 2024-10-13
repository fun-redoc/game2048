# game2048

math riddle game in typescript using browser canvas

## hot to develop

this projevt is build on vite, thouth only run

```
vite
```

in the terminal.

## how to run

running means deployment to github pages to access remotelly.

prerequisite is a github repository with activated github pages for the subfolder ```doc````.

run in terminal the following sequance of commands.

- `npm run build`
- `cp -rf dist/* docs`
- `sed -i 's/\/assets/\/game2048\/assets/g' docs/index.html`
- `git add .`
- `git commit -m "<some commit message>`

* wait some minutes for github to deploy the pages.

- start in browser:`https://<your github account>.github.io/game2048/`

the `sed`steps corrects the url for github pages.

those steps could be automated via npm later.
