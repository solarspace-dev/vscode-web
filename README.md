# VSCode Web

This project is used to compile VSCode web for Solarspace and publish it on the GitHub NPM registry.

This compilation is specifically maintained for the Solarpsace ecosystem. When you're looking for a general solution, checkout the original [Felix-B/vscode-web](https://github.com/Felx-B/vscode-web).

# Versioning

The versioning of this project follows the versioning of VSCode.
Changes made on-top of VSCode are reflected in the pre-release version.

For example: `1.100.0-solarspace.0` refers to VSCode version `1.100.0` and custom patch `0`. It's important to include our changes in the version-string so that we can publish patched versions of formerly released packages with the same VSCode version.