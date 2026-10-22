import { furnitureCatalogIssues, furnitureCatalogMarkdown } from "./catalog.ts";

const issues = furnitureCatalogIssues();
if (issues.length) {
  console.error(issues.map((issue) => `- ${issue}`).join("\n"));
  process.exitCode = 1;
} else {
  console.log(furnitureCatalogMarkdown());
}
