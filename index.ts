import { delay } from "https://deno.land/std@0.196.0/async/delay.ts";
import { colors, tty } from "https://deno.land/x/cliffy@v1.0.0-rc.3/ansi/mod.ts";

const error = colors.bold.red;
const warn = colors.bold.yellow;
const info = colors.bold.blue;

console.log(info("This is an info message!"));
console.log(warn("This is a warning!"));
console.log(error("This is an error message!"));
console.log(error.underline("This is a critical error message!"));

await delay(3000);

tty.cursorLeft.cursorUp(4).eraseDown();
