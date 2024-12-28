// import thoth from "@thoth";

// Data
import { defaultContentTypesSyncOptions } from "./data";

// Utils
import { Hermes } from "@iliad.dev/hermes";
import deepmerge from "deepmerge";
import chalk from "chalk";

// Types
import {
  StrictContentTypesSyncOptions,
  ContentTypesSyncOptions,
  ContentTypesResponse,
} from "./types";

async function loadFsIfAvailable(): Promise<undefined | typeof import("fs")> {
  try {
    return import("fs");
  } catch (error) {
    return undefined;
  }
}

function prefix(...args: any[]) {
  return [chalk.cyanBright("@iliad.dev/strapi-adapter"), ...args];
}

export type Options = {
  /**
	Include plus sign for positive numbers. If the difference is exactly zero a space character will be prepended instead for better alignment.

	@default false
	*/
  readonly signed?: boolean;

  /**
	- If `false`: Output won't be localized.
	- If `true`: Localize the output using the system/browser locale.
	- If `string`: Expects a [BCP 47 language tag](https://en.wikipedia.org/wiki/IETF_language_tag) (For example: `en`, `de`, …)
	- If `string[]`: Expects a list of [BCP 47 language tags](https://en.wikipedia.org/wiki/IETF_language_tag) (For example: `en`, `de`, …)

	@default false
	*/
  readonly locale?: boolean | string | readonly string[];

  /**
	Format the number as [bits](https://en.wikipedia.org/wiki/Bit) instead of [bytes](https://en.wikipedia.org/wiki/Byte). This can be useful when, for example, referring to [bit rate](https://en.wikipedia.org/wiki/Bit_rate).

	@default false

	@example
	```
	import prettyBytes from 'pretty-bytes';

	prettyBytes(1337, {bits: true});
	//=> '1.34 kbit'
	```
	*/
  readonly bits?: boolean;

  /**
	Format the number using the [Binary Prefix](https://en.wikipedia.org/wiki/Binary_prefix) instead of the [SI Prefix](https://en.wikipedia.org/wiki/SI_prefix). This can be useful for presenting memory amounts. However, this should not be used for presenting file sizes.

	@default false

	@example
	```
	import prettyBytes from 'pretty-bytes';

	prettyBytes(1000, {binary: true});
	//=> '1000 bit'

	prettyBytes(1024, {binary: true});
	//=> '1 kiB'
	```
	*/
  readonly binary?: boolean;

  /**
	The minimum number of fraction digits to display.

	If neither `minimumFractionDigits` or `maximumFractionDigits` are set, the default behavior is to round to 3 significant digits.

	@default undefined

	@example
	```
	import prettyBytes from 'pretty-bytes';

	// Show the number with at least 3 fractional digits
	prettyBytes(1900, {minimumFractionDigits: 3});
	//=> '1.900 kB'

	prettyBytes(1900);
	//=> '1.9 kB'
	```
	*/
  readonly minimumFractionDigits?: number;

  /**
	The maximum number of fraction digits to display.

	If neither `minimumFractionDigits` or `maximumFractionDigits` are set, the default behavior is to round to 3 significant digits.

	@default undefined

	@example
	```
	import prettyBytes from 'pretty-bytes';

	// Show the number with at most 1 fractional digit
	prettyBytes(1920, {maximumFractionDigits: 1});
	//=> '1.9 kB'

	prettyBytes(1920);
	//=> '1.92 kB'
	```
	*/
  readonly maximumFractionDigits?: number;

  /**
	Put a space between the number and unit.

	@default true

	@example
	```
	import prettyBytes from 'pretty-bytes';

	prettyBytes(1920, {space: false});
	//=> '1.9kB'

	prettyBytes(1920);
	//=> '1.92 kB'
	```
	*/
  readonly space?: boolean;
};

const BYTE_UNITS = ["B", "kB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];

const BIBYTE_UNITS = [
  "B",
  "KiB",
  "MiB",
  "GiB",
  "TiB",
  "PiB",
  "EiB",
  "ZiB",
  "YiB",
];

const BIT_UNITS = [
  "b",
  "kbit",
  "Mbit",
  "Gbit",
  "Tbit",
  "Pbit",
  "Ebit",
  "Zbit",
  "Ybit",
];

const BIBIT_UNITS = [
  "b",
  "kibit",
  "Mibit",
  "Gibit",
  "Tibit",
  "Pibit",
  "Eibit",
  "Zibit",
  "Yibit",
];

/*
Formats the given number using `Number#toLocaleString`.
- If locale is a string, the value is expected to be a locale-key (for example: `de`).
- If locale is true, the system default locale is used for translation.
- If no value for locale is specified, the number is returned unmodified.
*/
const toLocaleString = (
  n: number,
  locale?: boolean | string | readonly string[],
  options?: any
) => {
  let result: number | string = n;
  if (typeof locale === "string" || Array.isArray(locale)) {
    result = n.toLocaleString(locale, options);
  } else if (locale === true || options !== undefined) {
    result = n.toLocaleString(undefined, options);
  }

  return result;
};

export function prettyBytes(n: number, options?: Options): string {
  if (!Number.isFinite(n)) {
    throw new TypeError(`Expected a finite number, got ${typeof n}: ${n}`);
  }

  options = {
    bits: false,
    binary: false,
    space: true,
    ...options,
  };

  const UNITS = options.bits
    ? options.binary
      ? BIBIT_UNITS
      : BIT_UNITS
    : options.binary
      ? BIBYTE_UNITS
      : BYTE_UNITS;

  const separator = options.space ? " " : "";

  // @ts-ignore
  if (options.signed && n === 0) {
    return ` 0${separator}${UNITS[0]}`;
  }
  // @ts-ignore
  const isNegative = n < 0;
  const prefix = isNegative ? "-" : options.signed ? "+" : "";

  if (isNegative) {
    // @ts-ignore
    n = -n;
  }

  let localeOptions;

  if (options.minimumFractionDigits !== undefined) {
    localeOptions = { minimumFractionDigits: options.minimumFractionDigits };
  }

  if (options.maximumFractionDigits !== undefined) {
    localeOptions = {
      maximumFractionDigits: options.maximumFractionDigits,
      ...localeOptions,
    };
  }

  // @ts-ignore
  if (n < 1) {
    const numberString = toLocaleString(n, options.locale, localeOptions);
    return prefix + numberString + separator + UNITS[0];
  }

  const exponent = Math.min(
    Math.floor(
      options.binary
        ? // @ts-ignore
          Math.log(n) / Math.log(1024)
        : // @ts-ignore
          Math.log10(n) / 3
    ),
    UNITS.length - 1
  );
  // @ts-ignore
  n /= (options.binary ? 1024 : 1000) ** exponent;

  if (!localeOptions) {
    // @ts-ignore
    n = n.toPrecision(3);
  }

  const numberString = toLocaleString(Number(n), options.locale, localeOptions);

  const unit = UNITS[exponent];

  return prefix + numberString + separator + unit;
}

function formatContentTypes(contentTypes: string): string {
  return contentTypes;
}

function formatComponents(components: string): string {
  return components;
}

function formatApi(api: string): string {
  return api;
}

async function writeContentTypes(
  options: StrictContentTypesSyncOptions,
  data: ContentTypesResponse
): Promise<StandardResponse<string>> {
  const { outDir, names } = options;
  const [api, components, contentTypes] = data;

  const fs = await loadFsIfAvailable();

  // thoth.log("writing content types");
  const enc: any = {
    encoding: "utf8",
  };

  if (!fs) {
    // This shouldn't fail the operation, but it should be noted. Error will report later.
    return {
      data: undefined,
      error: {
        message: "ENOFS",
        code: 0,
      },
    };
  }

  try {
    if (!fs?.existsSync(outDir)) {
      console.warn(
        `[WARN] strapi-adapter: Directory ${outDir} does not exist. Creating...`
      );
      fs?.mkdirSync(outDir);
    }

    if (!contentTypes) throw new Error("Content types not found");
    const _contentTypes = formatContentTypes(contentTypes);
    fs?.writeFileSync(`${outDir}/${names.contentTypes}`, _contentTypes, enc);

    if (!components) throw new Error("Components not found");
    const _components = formatComponents(components);
    fs?.writeFileSync(`${outDir}/${names.components}`, _components, enc);

    if (!api) throw new Error("API not found");
    const _api = formatApi(api);
    fs?.writeFileSync(`${outDir}/${names.api}`, _api, enc);
  } catch (error) {
    console.error("Error writing content types", error);
    return {
      data: undefined,
      error: {
        message: "Error writing content types",
        code: 500,
      },
    };
  }

  const diskSize = prettyBytes(
    // @ts-ignore
    data.reduce((acc, curr) => acc + Buffer.byteLength(curr, "utf8"), 0)
  );

  return { data: diskSize, error: undefined };
}

export async function requestNewContentTypes(
  hermes: Hermes,
  endpoint: string
): Promise<StandardResponse<null>> {
  // const msg = thoth.$log("Requesting new content types...");

  const { data, error } = await hermes.axios.post<string>(endpoint, undefined);
  if (error !== undefined) {
    // msg.fail("Error requesting new content types").error(error);
    return { error, data: undefined };
  }

  // msg.succeed("New content types requested").debug(data);
  return { data: null, error: undefined };
}

export async function downloadContentTypes(
  hermes: Hermes,
  options: StrictContentTypesSyncOptions,
  endpoint: string,
  start: number = performance.now()
): Promise<StandardResponse<null>> {
  // const msg = thoth.$log("Downloading content types...");

  const { data: $1data, error: $1error } =
    await hermes.axios.get<ContentTypesResponse>(endpoint);

  if ($1error !== undefined) {
    // msg.fail("Error downloading content types");
    // msg._error($1error);
    return { error: $1error, data: undefined };
  }

  const { data: diskSize, error: $2error } = await writeContentTypes(
    options,
    $1data.data
  );
  if ($2error !== undefined) {
    // msg.fail("Error writing content types");
    // msg._error($2error);

    if ($2error?.message === "ENOFS") {
      console.warn(
        ...prefix(
          `${chalk.yellow("Warning: ")}Content types were downloaded but could not be written to disk, as the fs module was not found.\nAre you running ${chalk.yellow("syncContentTypes")}${chalk.white("()")} in a browser environment?`
        )
      );
    } else {
      return { error: $2error, data: undefined };
    }
  } else {
    const ts = (performance.now() - start).toFixed(2);
    console.log(
      ...prefix(
        `Content types downloaded and written to disk (${chalk.yellowBright(diskSize)}) in ${chalk.yellowBright(ts + "ms")}`
      )
    );
  }
  return { data: null, error: undefined };
}

// export function doContentTypesExist({
//   outDir,
//   names,
// }: StrictContentTypesSyncOptions): boolean {
//   console.log(1);
//   try {
//     let result: boolean = false;

//     loadFsIfAvailable()
//       .then((fs) => {
//         if (!fs) {
//           result = false;
//           return;
//         }
//         if (!fs.existsSync(outDir)) {
//           result = false;
//           return;
//         }

//         const files = fs.readdirSync(outDir);
//         console.log(
//           files.includes(names.contentTypes),
//           files.includes(names.components)
//         );

//         result =
//           files.includes(names.contentTypes) &&
//           files.includes(names.components);
//         return;
//       })
//       .catch((error) => {
//         console.error("Error checking if content types exist", error);
//         result = false;
//         return;
//       });

//     return result;
//   } catch (error) {
//     console.error("Error checking if content types exist", error);
//     return false;
//   }
// }

export function normalizeContentTypesOptions(
  options: ContentTypesSyncOptions
): StrictContentTypesSyncOptions {
  const merged = deepmerge(defaultContentTypesSyncOptions, options);
  return merged as StrictContentTypesSyncOptions; // I'm not spending eighteen hours making this type-safe
}
