<h1 align="center">
Zordon UI
</h1>

## 📦 Installation

**We recommend using `@angular/cli` to install**. It not only makes development easier, but also allows you to take advantage of the rich ecosystem of angular packages and tooling.

```bash
$ ng new PROJECT_NAME
$ cd PROJECT_NAME
$ ng add @pranxy/zordon-ui
```

> More information about `@angular/cli` [here](https://github.com/angular/angular-cli).

You can also install `@pranxy/zordon-ui` with npm or yarn

```bash
$ npm install @pranxy/zordon-ui
```

## 🔨 Usage

Import the component into your feature component.

```ts
import { ZdButton } from '@pranxy/zordon-ui/button';

@Component({
    imports: [ZdButton],
})
export class AppComponent {}
```

> `@angular/cli` users won't have to worry about the things below but it's good to know.

And import style and SVG icon assets file link in `angular.json`.

```diff
{
  ],
  "styles": [
+   "node_modules/@pranxy/zordon-ui/zordon-ui.min.css"
  ]
}
```

<!-- 
## 🔗 TODO: Links 

-   [Snippet extension for VSCode](https://marketplace.visualstudio.com/items?itemName=) -->

