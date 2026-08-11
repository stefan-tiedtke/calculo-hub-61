import { cp, mkdir, rm } from "node:fs/promises";
import { resolve } from "node:path";

const root = process.cwd();
const nitroOutput = resolve(root, ".output");
const sitesOutput = resolve(root, "dist");

await rm(sitesOutput, { recursive: true, force: true });
await mkdir(resolve(sitesOutput, "server"), { recursive: true });

await cp(resolve(nitroOutput, "server"), resolve(sitesOutput, "server"), {
  recursive: true,
});
await cp(resolve(nitroOutput, "public"), resolve(sitesOutput, "public"), {
  recursive: true,
});
await cp(resolve(nitroOutput, "public"), resolve(sitesOutput, "client"), {
  recursive: true,
});
await cp(resolve(nitroOutput, "nitro.json"), resolve(sitesOutput, "nitro.json"));

await cp(
  resolve(sitesOutput, "server", "index.mjs"),
  resolve(sitesOutput, "server", "index.js"),
);
