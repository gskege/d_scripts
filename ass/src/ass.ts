import { walk } from "https://deno.land/std/fs/mod.ts";

const noop = () => {};
const identity = <T>(v: T) => v;

const some = <T>(v: T) => {
  return {
    orElse: <T>(df: T) => {
      return v ?? df;
    },
  };
};
//解决编码问题
const decoder = new TextDecoder("utf-16");
const words = new Map<string, number>();
function last<T>(list: T[]) {
  const len = list.length - 1;
  return list[len];
}

function isWord(str: string): boolean {
  return /[a-zA-Z]+/g.test(str);
}

/**
 * 获取2个字母以上的单词
 * @param line
 * @returns
 */
const getWords = (line: string) => {
  return line
    .split(" ")
    .map((word) => {
      return word.replace(/[^a-zA-Z]/g, "");
    })
    .filter(isWord)
    .filter((word) => word.length > 1);
};

for await (const entry of walk(Deno.cwd(), { exts: [".ass"] })) {
  const data = await Deno.readFile(entry.path);
  const decodedData = decoder.decode(data.buffer);
  const lines = decodedData.split("\n").map((line) => {
    return last(last(line.split(","))?.split("}"));
  });

  lines.flatMap(getWords).forEach((v) => {
    if (words.has(v)) {
      words.set(v, some(words.get(v)).orElse(0) + 1);
    } else {
      words.set(v, 0);
    }
  });
}

/**
 * 写入到csv文件中
 */
Deno.writeTextFileSync(
  "./words.csv",
  Array.from(words.entries())
    .flatMap(([word, count]) => `${word},${count}`)
    .join("\n")
);
