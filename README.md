# Obsidian Auto Template

A simple, lightweight plugin that integrates with the [Templates core plugin](https://help.obsidian.md/Plugins/Templates) to automatically insert templates into new notes.

## Usage

When a new note is created, its path is checked against your configured patterns. If a match is found, the configured template is automatically inserted into the new note. If no match is found, nothing happens. That's it!

### Example

Let's say I have a `Movie` template containing properties and sections:

```
---
title: ""
director: ""
year: ""
rating: 5
---

## Summary

## Thoughts

```

I want to automatically apply this template to all notes created in the `Movies` folder. To do this, I would add the following pattern to the plugin's configuration:

```
Movies:Movie
```

Now, whenever I create a new note in `Movies/` or a nested directory like `Movies/Action/`, the `Movie` template will be automatically inserted into the new note.

## Patterns

Patterns consist of two elements, a [folder](#folder) and a [template](#template):

```
Folder:Template
```

### Folder

`Folder` may be any one of the following:

-   Plain text: `Folder:Template`
-   A JavaScript [regular expression](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_expressions), denoted by a pair of forward slashes: `/Folder/Template`
-   The special wildcard character `*`, which matches anything: `*:Template`

Folder paths are resolved from the root of your vault.

Examples:

-   `Restaurants:Restaurant`: matches `Restaurants/KFC`, `Restaurants/Popeye's`, and `Restaurants/Korean/Bonchon`
-   `/^Dates\\/\\d{4}-\\d{2}-\\d{2}$/:Daily`: matches `Dates/2023-01-01` and `1990-12-31`, but not `Dates/Overview` or `Nested/Dates/2023-01-01`
-   `*/Default`: matches anything

Note that as in the example above, backslashes in regular expressions **must** be escaped.

### Template

`Template` must match the name of a template file in your template directory, which is configured in the Templates core plugin's settings under `Templates -> Templates folder location`. Do not include the `.md` extension.

## Configuration

By default, the plugin does nothing. You must configure a list of [patterns](#patterns), with each pattern on a separate line:

```
Folder:Template
/Folder/Template
*:Template
```

Patterns are matched from top to bottom. If a note's path matches multiple patterns, only the first match is used.

In the above example, the wildcard pattern at the bottom works as a fallback for all notes that don't match the other two patterns.
