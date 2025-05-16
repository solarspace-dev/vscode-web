import {
  create
} from "vs/workbench/workbench.web.main";
import { URI } from "vs/base/common/uri";
import { IWorkbenchConstructionOptions, IWorkspace, IWorkspaceProvider } from "vs/workbench/browser/web.api";
declare const window: any;

(async function () {
  // create workbench
  let config: IWorkbenchConstructionOptions = {};

  if (window.product) {
    config = window.product;
  } else {
    const result = await fetch("product.json");
    config = await result.json();
  }

  if (Array.isArray(config.additionalBuiltinExtensions)) {
    const tempConfig = { ...config };

    tempConfig.additionalBuiltinExtensions =
      config.additionalBuiltinExtensions.map((ext) => URI.revive(ext));
    config = tempConfig;
  }

  const workspace = { folderUri: URI.parse(document.location.href) };
  const workspaceProvider: IWorkspaceProvider = {
    workspace,
    open: async (
      workspace: IWorkspace,
      options?: { reuse?: boolean; payload?: object }
    ) => true,
    trusted: true,
  };
  config = { ...config, workspaceProvider };

  const domElement = document.body;
  create(domElement, config);
})();