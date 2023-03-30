# Ultra Force React Typescript library

## Description

The library exists of various support classes for use with React and TypeScript.

It exists of code snippets found on the internet and conversions from other libraries.

## Installation

`npm install @ultraforce/ts-react-lib`

## Documentation

To view the generated documentation, visit: https://joshamunnik.github.io/ts-react-lib/

## Multi-language support

The library includes a set of components to handle multi-language. The components are located in the
`components/translation` folder.

Wrap the application in a `UFTranslationProvider` providing a current language, translations and optionally a html
parser.

The library does not enforce any format for the codes used to represent a language, so long as they are unique strings.
To use the original content of the translatable tags, use a language code for which there are no translations.

Example (with react redux and `html-react-parser`):
```tsx
// ... other imports
import translations from 'translations.json';
import parse from 'html-react-parser';

interface ApplicationProps {
  language: string;
}

function mapStateToProps(aState: ApplicationState) {
  return {
    // somewhere in the application state
    language: anApplicationState.settings.language
  }
}

export const Application = connect(mapStateToProps)(({language}: ApplicationProps) => {
  return (
    <UFTranslationProvider texts={translations} language={language} htmlParser={value => parse(value)}>
      <SomeOtherTags />
    </UFTranslationProvider>
  );
});
```

Wrap texts that need translation with `UFTT`, `UFTTSpan`, `UFTTDiv` or `UFTTHtml`. Either specifying an explicit ID via
`ttid` or use the children content as ID. When a language code is used for which there is no translated content, the
original content is used.

Use `html={true}` if the translation contains html tags. It will be processed by the html parser to create a node for
React. The current implementation does not support attributes within the html tags.

```tsx
export const Demo = () => (
  <div>
    <UFTT>Single</UFTT> <UFTT>or</UFTT> <UFTT ttid="some-id">use explicit ID with sentences</UFTT>.
  </div>  
);
```

Use the node commandline `bin/UFTTScanner.js` to scan `*.jsx` and `*.tsx` files and create or update a translation file.
The scanner will either create the translation and unused files or update the existing ones (preserving any
translated text).

Usage:
```
node bin/UFTTScanner.js
```

The scanner searches for a `ufttconfig.json` file in the current folder and all parent folders. The `ufttconfig.json`
should contain an object with the following fields:
- `sourceFolders: string[]` = an array of folders to scan.
- `targetFile: string` = a filename with path to store translation entries in
- `unusedFile: string` = a filename with path to stored entries from the target file whose IDs can no longer be found
- `languages: string[]` = an array of language codes to create empty entries for
- `]contentLanguage]: string` = a language code to add the scanned content for or an empty string to skip. This value is
  optional, the default value is `""`.
- `[tags]: string[]` = a list of tags to search for. This option is optional, the default value is
  `["UFTT", "UFTTSpan", "UFTTDiv", "UFTTHtml"]`
- `[cleanLanguages]: boolean` = when true remove any language that is no longer present in the `languages` list. This
  option is optional, the default value is `false`

Any paths specified in the configuration file are relative to the location of the configuration file.

The translations only need to contain the texts for other languages, but not the language the content was created for
since it is already present in the source. Use the `contentLanguage` to include the original content also as a text that
can be updated.

Example (with a project that created its own components with shorter names) of a configuration file placed in the
root of the project:
```json
{
  "sourceFolders": ["src"],
  "targetFile": "src/translations/translations.json",
  "unusedFile": "src/translations/unused.json",
  "languages": ["de"],
  "tags": ["TT", "TTSpan", "TTHtml", "TTDiv"]
}
```

The format of the generated translation file:
```json
{
  "id": {
    "_": "content found in the source file",
    "language code": "translated text or empty string if translation still needs to be done",
    "other language code": ""
  },
  "id2": {
    "_": "...",
    "language": "...",
    "other language code": ""
  }
}
```

The `"_"` is created by the scanner for informational purpose, it is ignored by the translation components. It does
not have to be included when creating a translation file in another manner.
