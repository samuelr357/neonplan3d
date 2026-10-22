#!/usr/bin/env python3
"""Transplant procedural MIT furniture (not paid packs) from pinned PATCoder97 source."""
import json
import re
import shutil
import sys
from pathlib import Path
root=Path(__file__).resolve().parents[1]
up=Path(sys.argv[1]).resolve()
src=root/"frontend/src"
assert "MIT License" in (up/"LICENSE").read_text()
assert (up/"frontend/src/furniture/metadata.ts").exists()
def read(p): return (src/p).read_text(encoding="utf8")
def save(p,s): (src/p).write_text(s,encoding="utf8")
def replace(p,a,b):
    s=read(p)
    assert a in s,(p,a)
    save(p,s.replace(a,b,1))
for folder in ["furniture","viewer/furniture-models","components/furniture-symbols"]:
    origin=up/"frontend/src"/folder
    dest=src/folder
    dest.mkdir(parents=True,exist_ok=True)
    for f in origin.glob("*.ts"):
        if not f.name.endswith(".test.ts"): shutil.copyfile(f,dest/f.name)
shutil.copyfile(up/"frontend/src/viewer/furniture-builder.ts",src/"viewer/furniture-builder.ts")
meta=read("furniture/metadata.ts")
pat_list=re.search(r'export const FURNITURE_TYPES = \[(.*?)\] as const;',meta,re.S).group(1)
pat_ids=list(dict.fromkeys(re.findall(r'"([^"]+)"',pat_list)))
model=read("model.ts")
local_list=re.search(r'export const FURNITURE_TYPES = \[(.*?)\] as const;',model,re.S).group(1)
local_ids=list(dict.fromkeys(re.findall(r'"([^"]+)"',local_list)))
assert len(pat_ids)>450 and len(set(pat_ids)-set(local_ids))>330
replace("model.ts","export const FURNITURE_TYPES = [","export const FURNITURE_TYPES = [\n  ...PAT_FURNITURE_TYPES,")
replace("model.ts","export const FURNITURE_SIZE: Record<FurnitureType, [number, number, number]> = {","export const FURNITURE_SIZE: Record<FurnitureType, [number, number, number]> = {\n  ...PAT_FURNITURE_SIZE,")
replace("model.ts","export const FURNITURE_GROUPS: Record<string, FurnitureType[]> = {","const LOCAL_FURNITURE_GROUPS: Record<string, FurnitureType[]> = {")
s=read("model.ts")
s=('import { FURNITURE_TYPES as PAT_FURNITURE_TYPES, FURNITURE_GROUPS as PAT_FURNITURE_GROUPS, FURNITURE_SIZE as PAT_FURNITURE_SIZE } from "./furniture/metadata.ts";\n'+s)
idx=s.index("const LOCAL_FURNITURE_GROUPS: Record<string, FurnitureType[]> = {")
end=s.index("\n};",idx)+3
s=s[:end]+'''
export const FURNITURE_GROUPS: Record<string, FurnitureType[]> = Object.fromEntries(
  [...new Set([...Object.keys(PAT_FURNITURE_GROUPS), ...Object.keys(LOCAL_FURNITURE_GROUPS)])]
    .map((group) => [group, [...new Set([
      ...(PAT_FURNITURE_GROUPS[group] ?? []),
      ...(LOCAL_FURNITURE_GROUPS[group] ?? []),
    ])] as FurnitureType[]]),
);
'''+s[end:]
save("model.ts",s)
s=read("library-index.ts")
s='import { FURNITURE_TYPES as PAT_IDS, FURNITURE_GROUPS as PAT_GROUPS } from "./furniture/metadata.ts";\n'+s
s=s.replace("const BASIC: Record<string, [Kind, Room[]]> = {","const BASIC_LOCAL: Record<string, [Kind, Room[]]> = {",1)
i=s.index("const BASIC_LOCAL: Record<string, [Kind, Room[]]> = {")
end=s.index("\n};",i)+3
s=s[:end]+'''
const PAT_CLASSIFICATION: Record<string, [Kind, Room[]]> = {
  lights: ["lamp", []], living: ["storage", ["living"]],
  dining: ["table", ["dining"]], kitchen: ["kitchen", ["kitchen"]],
  sleeping: ["storage", ["bedroom","kids"]], bath: ["bath", ["bath"]],
  climate: ["heating", []], outdoor: ["outdoor", ["garden"]],
  work: ["office", ["office","hobby"]], vehicles: ["vehicle", ["garage"]],
  utility: ["tech", ["utility","garage"]], smart_home: ["tech", []],
  garden: ["outdoor", ["garden"]], garage: ["office", ["garage"]],
  pets: ["pets", []], fitness: ["sport", ["hobby"]],
  architecture: ["architecture", []], stairs: ["stairs", []],
  cinema: ["media", ["living","hobby"]], kids: ["kids", ["kids"]],
};
const BASIC: Record<string, [Kind, Room[]]> = Object.fromEntries(
  PAT_IDS.map((type) => {
    const group = Object.entries(PAT_GROUPS).find(([, types]) => types.includes(type))?.[0] ?? "work";
    return [type, PAT_CLASSIFICATION[group] ?? ["office",["office"]]];
  }),
);
Object.assign(BASIC,BASIC_LOCAL);
'''+s[end:]
save("library-index.ts",s)
s=read("viewer/furniture.ts")
s=('import { FurnitureBuilder as PATFurnitureBuilder } from "./furniture-builder.ts";\n'
   'import { renderRegisteredFurniture, registeredFurnitureScreen } from "./furniture-models/index.ts";\n'
   'const LOCAL_FURNITURE_IDS = new Set<string>('+json.dumps(local_ids)+');\n'+s)
a='  if (f.type === "tv_board") {'
assert a in s
s=s.replace(a,'''  if (!LOCAL_FURNITURE_IDS.has(f.type)) {
    const patScreen = registeredFurnitureScreen(f.type, w, d, h);
    if (patScreen !== undefined) return patScreen;
  }
'''+a,1)
a='    default: {\n      const item = packItem(f.type);'
assert a in s
s=s.replace(a,'''    default: {
      if (!LOCAL_FURNITURE_IDS.has(f.type)) {
        const result = renderRegisteredFurniture(f.type, {
          b: new PATFurnitureBuilder(buf, lines, tf), w, d, h, base, variant: f.variant ?? null,
        });
        if (result !== null) {
          if (result === false || base > 0.05) return;
          break;
        }
      }
      const item = packItem(f.type);''',1)
save("viewer/furniture.ts",s)
replace("components/furniture2d.ts",
    'import { nothing, svg, type SVGTemplateResult } from "lit";',
    'import { nothing, svg, type SVGTemplateResult } from "lit";\nimport { registeredFurnitureSymbol } from "./furniture-symbols/index.ts";')
replace("components/furniture2d.ts",
    '    default: {\n      const item = packItem(type);',
    '    default: {\n      const registered = registeredFurnitureSymbol(type, w, d);\n      if (registered) return registered;\n      const item = packItem(type);')
# Preserve local labels and extend untranslated items with readable English names.
s=read("furniture-names.ts")
s='import { FURNITURE_TYPES as PAT_IDS } from "./furniture/metadata.ts";\n'+s
s,n=re.subn(r'  if \(!isPackType\(type\)\) return translate\(hass, .*?;\n',
lambda _: '''  if (!isPackType(type)) {
    const key = "furn_" + type;
    const label = translate(hass, key as Parameters<typeof translate>[1]);
    if (label === key && (PAT_IDS as readonly string[]).includes(type)) {
      return type.replaceAll("_", " ").replace(/\\b\\w/g, (s) => s.toUpperCase());
    }
    return label;
  }
''',s,count=1)
assert n==1
save("furniture-names.ts",s)
# Merge MIT Portuguese localization without overriding existing UI translations.
file=root/"frontend/lang/pt.json"
d=json.loads(file.read_text())
patfile=up/"frontend/lang/pt.json"
if patfile.exists():
    for k,v in json.loads(patfile.read_text()).items():
        if k.startswith("furn_"): d.setdefault(k,v)
file.write_text(json.dumps(d,ensure_ascii=False,indent=1)+"\n")
file=root/"frontend/build.mjs"
s=file.read_text()
for key,size in {"neonplan3d.js":1000,"neonplan3d-3d.js":2300,
                 "neonplan3d-editor.js":2400,"neonplan3d-card-editor.js":380,
                 "neonplan3d-fun.js":95,"neonplan3d-voice.js":110,"neonplan3d-timetravel.js":190}.items():
    s,n=re.subn(r'("'+re.escape(key)+r'": )\d+( \* 1024)',
                lambda m:m[1]+str(size)+m[2],s)
    assert n==1,key
file.write_text(s)
(root/"docs/PAT-MIT-LICENSE.txt").write_text((up/"LICENSE").read_text())
(root/"docs/PAT-MIT-MODELS.md").write_text(
    "Procedural MIT catalog from PATCoder97/neonplan3d commit ffccbb4818d3c75d8a5c4372bc27ea1dedc75211.\n"
    "No commercial packages, signed furniture packs, or license keys are included.\n"
    "Existing local models take precedence. New catalog models use PAT source geometries and SVG symbols.\n")
(src/"pat-library.test.ts").write_text('''import assert from "node:assert/strict";
import { test } from "node:test";
import { FURNITURE_TYPES as PAT_IDS } from "./furniture/metadata.ts";
import { FURNITURE_TYPES, FURNITURE_SIZE } from "./model.ts";
import { basicTypes } from "./library-index.ts";
import { BUILTIN_FURNITURE_MODELS } from "./viewer/furniture-models/index.ts";
test("MIT furniture library registered", () => {
  assert.ok(PAT_IDS.length >= 450);
  const enabled = new Set(basicTypes());
  for (const type of PAT_IDS) {
    assert.ok(FURNITURE_TYPES.includes(type));
    assert.ok(FURNITURE_SIZE[type]);
    if (Object.values(BUILTIN_FURNITURE_MODELS).length && enabled.has(type))
      assert.ok(FURNITURE_SIZE[type].every((v) => v > 0));
  }
  for (const type of ["dog_bed", "fitness_treadmill","laser_printer"])
    assert.ok(BUILTIN_FURNITURE_MODELS[type]);
});
''')

# The expanded free library also contains a generic chesterfield item, so a
# search for chester matches both the built-in model and the sample pack.
p=root/"frontend/src/library-index.test.ts"
t=p.read_text()
a='assert.equal(filterEntries(entries, { ...none, query: "chester" }).length, 1);'
b='assert.ok(filterEntries(entries, { ...none, query: "chester" }).some((e) => e.type === "pack:mastershort.living:chesterfield"));'
assert a in t
p.write_text(t.replace(a,b,1))
print("Imported",len(pat_ids),"MIT types,",len(set(pat_ids)-set(local_ids)),"new to local")
