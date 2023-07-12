import { BunPlugin, OnLoadCallback } from "bun";
import { existsSync, readdirSync, statSync } from "fs";
import { exists, readFile, readdir, stat } from "fs/promises";
import {
  join,
  relative,
  dirname,
  isAbsolute,
  normalize,
  basename,
  extname,
} from "path";

const routes = "routes";

export function bunFsRouterPlugin(): BunPlugin {
  return {
    name: "bun-fs-router-plugin",
    setup(build) {
      build.onLoad(
        {
          filter: /.+/, //TODO choose a more performant regex
        },
        async (args) => {
          const routesPath = join(dirname(args.path), routes);

          // Check if the routes directory exists, so we would need to import all its contents
          if (await exists(routesPath)) {
            let fileContent = await readFile(args.path, {
              encoding: "utf-8",
            });
            const paths = await getAllFilePaths(routesPath);
            fileContent =
              paths
                .map(
                  (f) =>
                    `import "./${routes}/${f.substring(
                      0,
                      f.length - extname(f).length
                    )}"\n`
                )
                .reduce((a, b) => a + b) + fileContent;
            return {
              contents: fileContent,
            };
          }

          // If this is not the case, we might be currently inside the routes directory, so check that
          if (args.path.includes(`/${routes}/`)) {
            let fileContent = await readFile(args.path, {
              encoding: "utf-8",
            });

            return {
              contents: fileContent,
            };
          }

          return undefined as any;
        }
      );
    },
  };
}

import path from "path";
import { promises as fs } from "fs";

async function getAllFilePaths(directoryPath: string) {
  const fileNames = await fs.readdir(directoryPath);
  const filePaths: string[] = [];

  await Promise.all(
    fileNames.map(async (fileName) => {
      const filePath = path.join(directoryPath, fileName);
      const stats = await fs.stat(filePath);

      if (stats.isFile()) {
        filePaths.push(fileName); // Add relative path (file name) instead of absolute path
      } else if (stats.isDirectory()) {
        const subDirectoryFilePaths = await getAllFilePaths(filePath);
        filePaths.push(
          ...subDirectoryFilePaths.map((subFilePath) =>
            path.join(fileName, subFilePath)
          )
        ); // Add relative paths for subdirectories
      }
    })
  );

  return filePaths;
}
