# composite-call

## Installation

```bash
npm i composite-call
```

If you want to automatically get composed function parameter names, you can use our [transformer](#transformer)

## The problem

There are situations, when you need to send request to your API, then pass it's result into second request. The solution is to write custom function on your server, to combine these two functions.

Or, you can use `composite-call`.

`composite-call` is a tool, for building composite request on the client-side. Using `composite-call`, you can manually write function on your server to receive sequence of calls and execute it.

## Sample usage

```ts
import { compose } from 'composite-call';

const findUser = (email: string): User => {
    /* send request */
};

const changePassword = (user: User, newPassword: string): boolean => {
    /* send request */
};

compose(findUser, 'user@mail.com')
    .then((user) => compose(changePassword, user, 'new pass'))
    .call((sequence) => {
        /* use sequence to send request into your composite api */
    });
```

Or, if you want to specify default send request function:

```ts
import { compose, CompositeCall } from 'composite-call';

CompositeCall.sendRequest = (sequence) => {
    /* send your request */
};

compose(findUser, 'user@mail.com')
    .then((user) => compose(changePassword, user))
    .call(); // will use default sendRequest
```

[More examples.](https://github.com/ArtiomTr/composite-call/tree/master/example)

## Transformer

> ⚠️ This requires TypeScript version >=2.4.1

Import transformer:

```js
var transformer = require('composite-call/dist/transformer');
```

And then use it in your bundler. For example, with [webpack](https://github.com/webpack/webpack#readme) and [ts-loader](https://github.com/TypeStrong/ts-loader#readme):

```js
var transformer = require('composite-call/dist/transformer');

module.exports = {
    ...
    module: {
        rules: [
            {
                test: /\.ts$/,
                loader: 'ts-loader',
                options: {
                    getCustomTransformers: (program) => ({
                        before: [transformer(program)],
                    }),
                },
            },
        ],
    },
};
```

## License

MIT © [ArtiomTr](https://github.com/ArtiomTr)
